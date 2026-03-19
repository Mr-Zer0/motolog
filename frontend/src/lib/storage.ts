import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { storage } from './firebase'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10 MB

export async function uploadAttachment(file: File): Promise<string> {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('Image must be smaller than 10 MB.')
  }
  const path = `attachments/${Date.now()}_${file.name}`
  const storageRef = ref(storage, path)
  await uploadBytes(storageRef, file)
  return getDownloadURL(storageRef)
}
