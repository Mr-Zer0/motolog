import io
import logging
import os
from PIL import Image
from firebase_functions import storage_fn
from firebase_functions.options import MemoryOption
from firebase_admin import initialize_app, storage as admin_storage
from google.auth.credentials import AnonymousCredentials
from google.cloud import storage as gcs

initialize_app()

logger = logging.getLogger(__name__)

MAX_DIMENSION = int(os.environ.get("MAX_DIMENSION", "1920"))
JPEG_QUALITY = int(os.environ.get("JPEG_QUALITY", "85"))

_storage_emulator_host = os.environ.get("STORAGE_EMULATOR_HOST")
if _storage_emulator_host:
    logger.warning("Emulator mode — using AnonymousCredentials against %s", _storage_emulator_host)
    _emulator_client = gcs.Client(
        credentials=AnonymousCredentials(),
        project="motolog-c87ac",
        client_options={"api_endpoint": _storage_emulator_host},
    )
else:
    _emulator_client = None
OPTIMIZED_FLAG = "optimized"


@storage_fn.on_object_finalized(
    region="us-central1",
    memory=MemoryOption.MB_512,
    timeout_sec=120,
)
def optimize_image(event: storage_fn.CloudEvent[storage_fn.StorageObjectData]) -> None:
    data = event.data

    # Scope: only process attachments/
    object_name: str = data.name or ""
    if not object_name.startswith("attachments/"):
        return

    # Anti-loop: skip already-optimized files
    custom_metadata: dict = data.metadata or {}
    if custom_metadata.get(OPTIMIZED_FLAG) == "true":
        logger.info("Skipping %s — already optimized", object_name)
        return

    # Only process JPEG and PNG
    content_type: str = data.content_type or ""
    if content_type == "image/jpeg":
        pil_format = "JPEG"
    elif content_type == "image/png":
        pil_format = "PNG"
    else:
        logger.info("Skipping %s — unsupported type %s", object_name, content_type)
        return

    # Download
    if _emulator_client:
        bucket = _emulator_client.bucket(data.bucket)
    else:
        bucket = admin_storage.bucket(data.bucket)
    blob = bucket.blob(object_name)
    original_bytes = blob.download_as_bytes()

    # Process
    image = Image.open(io.BytesIO(original_bytes))

    # Convert RGBA/P → RGB for JPEG (PNG keeps original mode)
    if pil_format == "JPEG" and image.mode in ("RGBA", "P", "LA"):
        image = image.convert("RGB")

    # Resize: only downscale, preserve aspect ratio
    image.thumbnail((MAX_DIMENSION, MAX_DIMENSION), Image.LANCZOS)

    # Encode
    output_buffer = io.BytesIO()
    if pil_format == "JPEG":
        image.save(output_buffer, format="JPEG", quality=JPEG_QUALITY, optimize=True, progressive=True)
    else:
        image.save(output_buffer, format="PNG", optimize=True)
    optimized_bytes = output_buffer.getvalue()

    logger.info(
        "Optimized %s: %d → %d bytes",
        object_name, len(original_bytes), len(optimized_bytes),
    )

    # Upload in-place with anti-loop metadata flag
    new_metadata = {**custom_metadata, OPTIMIZED_FLAG: "true"}
    blob.metadata = new_metadata
    blob.upload_from_string(optimized_bytes, content_type=content_type)

    logger.info("Replaced %s with optimized version", object_name)
