<script lang="ts">
  import { X, ArrowLeft, Wrench, Sliders, Hammer, Fuel, ClipboardCheck, Sparkles, MoreHorizontal } from 'lucide-svelte'
  import { addLogEntry } from '@/stores/app'
  import { uploadAttachment } from '@/lib/storage'
  import { navigate } from '@/lib/router'
  import type { LogType } from '@/types'

  const today = () => new Date().toISOString().slice(0, 10)

  let date = $state(today())
  let odometer = $state('')
  let type = $state<LogType | ''>('')
  let title = $state('')
  let description = $state('')
  let cost = $state('')
  let file = $state<File | null>(null)
  let previewUrl = $state<string | null>(null)
  let uploading = $state(false)
  let saveError = $state('')
  let errors = $state<Partial<Record<'date' | 'type' | 'title', string>>>({})

  function handleFileChange(e: Event) {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    file = (e.target as HTMLInputElement).files?.[0] ?? null
    previewUrl = file ? URL.createObjectURL(file) : null
  }

  function clearFile() {
    file = null
    if (previewUrl) { URL.revokeObjectURL(previewUrl); previewUrl = null }
    const input = document.getElementById('log-file') as HTMLInputElement | null
    if (input) input.value = ''
  }

  function reset() {
    date = today()
    odometer = ''
    type = ''
    title = ''
    description = ''
    cost = ''
    if (previewUrl) { URL.revokeObjectURL(previewUrl); previewUrl = null }
    file = null
    uploading = false
    saveError = ''
    errors = {}
  }

  function handleBack() {
    reset()
    navigate('/')
  }

  async function handleSave() {
    const newErrors: typeof errors = {}
    if (!date) newErrors.date = 'Date is required'
    if (!type) newErrors.type = 'Type is required'
    if (!title.trim()) newErrors.title = 'Title is required'
    if (Object.keys(newErrors).length > 0) {
      errors = newErrors
      return
    }

    uploading = true
    saveError = ''
    try {
      const attachmentUrl = file ? await uploadAttachment(file) : null
      await addLogEntry({
        date,
        odometer: odometer ? Number(odometer) : null,
        type: type as LogType,
        title: title.trim(),
        description: description.trim() || null,
        cost: cost ? Number(cost) : null,
        attachment_url: attachmentUrl,
      })
      navigate('/')
    } catch (e) {
      saveError = e instanceof Error ? e.message : 'Failed to save. Please try again.'
    } finally {
      uploading = false
    }
  }

  const inputClass =
    'w-full bg-input border border-border rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background'
  const labelClass = 'text-xs font-medium text-muted-foreground'

  const typeIcons: Record<string, typeof Wrench> = {
    maintenance: Wrench,
    modification: Sliders,
    repair: Hammer,
    fuel: Fuel,
    inspection: ClipboardCheck,
    cleaning: Sparkles,
    other: MoreHorizontal,
  }
</script>

<div class="p-4 space-y-5">
  <!-- Header -->
  <div class="flex items-center gap-2 -mx-1">
    <button
      onclick={handleBack}
      class="p-1.5 rounded-md text-muted-foreground hover:text-foreground transition-colors"
      aria-label="Back"
    >
      <ArrowLeft size={20} />
    </button>
    <h1 class="text-xl font-bold text-foreground">New log entry</h1>
  </div>

  <div class="space-y-4">
    <!-- Type -->
    <div class="space-y-1.5">
      <p class={labelClass}>Type</p>
      <div class="grid grid-cols-4 gap-1.5">
        {#each ['maintenance', 'modification', 'repair', 'fuel', 'inspection', 'cleaning', 'other'] as t (t)}
          {@const Icon = typeIcons[t]}
          <button
            type="button"
            onclick={() => { type = t as LogType; errors = { ...errors, type: undefined } }}
            class="flex flex-col items-center gap-1 py-2 rounded-md text-xs font-medium border transition-colors capitalize
              {type === t
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-input border-border text-muted-foreground hover:text-foreground'}"
          >
            <Icon size={15} />
            {t}
          </button>
        {/each}
      </div>
      {#if errors.type}<p class="text-xs text-destructive">{errors.type}</p>{/if}
    </div>

    <!-- Title -->
    <div class="space-y-1">
      <label for="log-title" class={labelClass}>Title</label>
      <input
        id="log-title"
        bind:value={title}
        placeholder="e.g. Oil change"
        class="{inputClass} {errors.title ? 'border-destructive' : ''}"
      />
      {#if errors.title}<p class="text-xs text-destructive">{errors.title}</p>{/if}
    </div>

    <!-- Odometer + Date -->
    <div class="grid grid-cols-2 gap-3">
      <div class="space-y-1">
        <label for="log-odo" class={labelClass}>Odometer (km)</label>
        <input
          id="log-odo"
          type="number"
          bind:value={odometer}
          placeholder="e.g. 2800"
          min={0}
          class={inputClass}
        />
      </div>
      <div class="space-y-1">
        <label for="log-date" class={labelClass}>Date</label>
        <input
          id="log-date"
          type="date"
          bind:value={date}
          class="{inputClass} {errors.date ? 'border-destructive' : ''}"
        />
        {#if errors.date}<p class="text-xs text-destructive">{errors.date}</p>{/if}
      </div>
    </div>

    <!-- Cost -->
    <div class="space-y-1">
      <label for="log-cost" class={labelClass}>Cost (฿)</label>
      <input
        id="log-cost"
        type="number"
        bind:value={cost}
        placeholder="e.g. 450"
        min={0}
        class={inputClass}
      />
    </div>

    <!-- Notes -->
    <div class="space-y-1">
      <label for="log-desc" class={labelClass}>Notes</label>
      <textarea
        id="log-desc"
        bind:value={description}
        placeholder="Optional notes..."
        rows={3}
        class={inputClass}
      ></textarea>
    </div>

    <!-- Attachment -->
    <div class="space-y-1">
      <label for="log-file" class={labelClass}>Attachment</label>
      {#if file && previewUrl}
        <div class="relative w-full rounded-md overflow-hidden border border-border">
          <img src={previewUrl} alt="Preview" class="w-full max-h-48 object-cover" />
          <button
            onclick={clearFile}
            class="absolute top-2 right-2 p-1 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
            aria-label="Remove file"
          >
            <X size={14} />
          </button>
          <p class="px-3 py-1.5 text-xs text-muted-foreground truncate border-t border-border bg-input">{file.name}</p>
        </div>
      {:else}
        <input
          id="log-file"
          type="file"
          accept="image/*"
          onchange={handleFileChange}
          class="w-full text-sm text-muted-foreground file:mr-3 file:px-3 file:py-1.5 file:rounded-md file:border file:border-border file:bg-input file:text-foreground file:text-sm file:font-medium file:cursor-pointer hover:file:text-foreground cursor-pointer"
        />
      {/if}
    </div>
  </div>

  {#if saveError}
    <p class="text-xs text-destructive">{saveError}</p>
  {/if}

  <!-- Actions -->
  <div class="flex justify-end gap-2 pt-1">
    <button
      onclick={handleBack}
      disabled={uploading}
      class="hidden sm:block px-4 py-2 text-sm font-medium border border-border text-muted-foreground rounded-md hover:text-foreground transition-colors disabled:opacity-50"
    >
      Cancel
    </button>
    <button
      onclick={handleSave}
      disabled={uploading}
      class="w-full sm:w-auto px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary-hover transition-colors disabled:opacity-50"
    >
      {uploading ? 'Uploading…' : 'Save'}
    </button>
  </div>
</div>
