<script lang="ts">
  import { addLogEntry } from '@/stores/app'
  import type { LogType } from '@/types'

  let { open = $bindable(false) }: { open: boolean } = $props()

  const today = () => new Date().toISOString().slice(0, 10)

  let date = $state(today())
  let odometer = $state('')
  let type = $state<LogType | ''>('')
  let title = $state('')
  let description = $state('')
  let cost = $state('')
  let hasAttachment = $state(false)
  let errors = $state<Partial<Record<'date' | 'type' | 'title', string>>>({})

  function reset() {
    date = today()
    odometer = ''
    type = ''
    title = ''
    description = ''
    cost = ''
    hasAttachment = false
    errors = {}
  }

  function close() {
    reset()
    open = false
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

    await addLogEntry({
      date,
      odometer: odometer ? Number(odometer) : null,
      type: type as LogType,
      title: title.trim(),
      description: description.trim() || null,
      cost: cost ? Number(cost) : null,
      has_attachment: hasAttachment,
    })
    close()
  }

  const inputClass =
    'w-full bg-input border border-border rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background'
  const labelClass = 'text-xs font-medium text-muted-foreground'
</script>

{#if open}
  <!-- Backdrop -->
  <div
    role="presentation"
    class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
    onclick={close}
    onkeydown={e => e.key === 'Escape' && close()}
  >
    <!-- Modal panel -->
    <div
      role="dialog"
      aria-modal="true"
      aria-label="New log entry"
      tabindex="-1"
      class="w-full max-w-sm bg-card rounded-xl border border-border shadow-xl p-6 space-y-4"
      onclick={e => e.stopPropagation()}
      onkeydown={e => e.stopPropagation()}
    >
      <h2 class="text-base font-semibold text-foreground">New log entry</h2>

      <div class="space-y-3">
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

        <div class="space-y-1">
          <label for="log-type" class={labelClass}>Type</label>
          <select
            id="log-type"
            bind:value={type}
            class="w-full bg-input border {errors.type
              ? 'border-destructive'
              : 'border-border'} rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
          >
            <option value="" disabled>Select type</option>
            <option value="maintenance">Maintenance</option>
            <option value="modification">Modification</option>
            <option value="repair">Repair</option>
            <option value="fuel">Fuel</option>
            <option value="inspection">Inspection</option>
            <option value="cleaning">Cleaning</option>
            <option value="other">Other</option>
          </select>
          {#if errors.type}<p class="text-xs text-destructive">{errors.type}</p>{/if}
        </div>

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

        <div class="flex items-center gap-2">
          <input
            id="log-attachment"
            type="checkbox"
            bind:checked={hasAttachment}
            class="w-4 h-4 accent-primary"
          />
          <label for="log-attachment" class={labelClass}>Has attachment</label>
        </div>
      </div>

      <div class="flex justify-end gap-2 pt-1">
        <button
          onclick={close}
          class="px-4 py-2 text-sm font-medium border border-border text-muted-foreground rounded-md hover:text-foreground transition-colors"
        >
          Cancel
        </button>
        <button
          onclick={handleSave}
          class="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary-hover transition-colors"
        >
          Save
        </button>
      </div>
    </div>
  </div>
{/if}
