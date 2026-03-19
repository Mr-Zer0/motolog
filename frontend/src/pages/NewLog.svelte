<script lang="ts">
  import { ArrowLeft } from 'lucide-svelte'
  import { addLogEntry } from '@/stores/app'
  import { uploadAttachment } from '@/lib/storage'
  import { navigate } from '@/lib/router'
  import LogForm from '@/components/LogForm.svelte'
  import type { LogFormData } from '@/components/LogForm.svelte'
  import type { LogType } from '@/types'

  async function handleSave(data: LogFormData) {
    const attachmentUrl = data.file ? await uploadAttachment(data.file) : null
    await addLogEntry({
      date: data.date,
      odometer: data.odometer ? Number(data.odometer) : null,
      type: data.type as LogType,
      title: data.title,
      description: data.description || null,
      cost: data.cost ? Number(data.cost) : null,
      attachment_url: attachmentUrl,
    })
    navigate('/')
  }
</script>

<div class="p-4 space-y-5">
  <div class="flex items-center gap-2 -mx-1">
    <button
      onclick={() => navigate('/')}
      class="p-1.5 rounded-md text-muted-foreground hover:text-foreground transition-colors"
      aria-label="Back"
    >
      <ArrowLeft size={20} />
    </button>
    <h1 class="text-xl font-bold text-foreground">New log entry</h1>
  </div>

  <LogForm withAttachment submitLabel="Save" onSave={handleSave} onCancel={() => navigate('/')} />
</div>
