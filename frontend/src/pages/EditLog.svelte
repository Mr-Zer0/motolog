<script lang="ts">
  import { ArrowLeft } from 'lucide-svelte'
  import { logEntries, updateLogEntry } from '@/stores/app'
  import { uploadAttachment } from '@/lib/storage'
  import { navigate } from '@/lib/router'
  import LogForm from '@/components/LogForm.svelte'
  import type { LogFormData } from '@/components/LogForm.svelte'
  import type { LogType } from '@/types'

  let { id }: { id: string } = $props()

  let entry = $derived($logEntries.find(e => e.id === id) ?? null)

  async function handleSave(data: LogFormData) {
    const attachmentUrl = data.file
      ? await uploadAttachment(data.file)
      : data.existingAttachmentUrl
    await updateLogEntry(id, {
      date: data.date,
      type: data.type as LogType,
      title: data.title,
      odometer: data.odometer ? Number(data.odometer) : null,
      cost: data.cost ? Number(data.cost) : null,
      description: data.description || null,
      attachment_url: attachmentUrl,
    })
    navigate(`/log/${id}`)
  }
</script>

<div class="p-4 space-y-5">
  <div class="flex items-center gap-2 -mx-1">
    <button
      onclick={() => navigate(`/log/${id}`)}
      class="p-1.5 rounded-md text-muted-foreground hover:text-foreground transition-colors"
      aria-label="Back"
    >
      <ArrowLeft size={20} />
    </button>
    <h1 class="text-xl font-bold text-foreground">Edit log entry</h1>
  </div>

  {#if !entry}
    <div class="py-16 text-center">
      <p class="text-muted-foreground">Entry not found.</p>
    </div>
  {:else}
    <LogForm
      withAttachment
      initialValues={{
        date: entry.date,
        odometer: entry.odometer != null ? String(entry.odometer) : '',
        type: entry.type,
        title: entry.title,
        description: entry.description ?? '',
        cost: entry.cost != null ? String(entry.cost) : '',
        attachmentUrl: entry.attachment_url,
      }}
      submitLabel="Save changes"
      onSave={handleSave}
      onCancel={() => navigate(`/log/${id}`)}
    />
  {/if}
</div>
