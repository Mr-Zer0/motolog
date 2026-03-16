<script lang="ts">
  import { X, ArrowLeft, Wrench, Sliders, Hammer, Fuel, ClipboardCheck, Sparkles, MoreHorizontal } from 'lucide-svelte'
  import { logEntries, updateLogEntry } from '@/stores/app'
  import { navigate } from '@/lib/router'
  import type { LogType } from '@/types'

  let { id }: { id: string } = $props()

  let entry = $derived($logEntries.find(e => e.id === id) ?? null)

  let date = $state('')
  let odometer = $state('')
  let type = $state<LogType | ''>('')
  let title = $state('')
  let description = $state('')
  let cost = $state('')
  let saving = $state(false)
  let saveError = $state('')
  let errors = $state<Partial<Record<'date' | 'type' | 'title', string>>>({})
  let populated = $state(false)

  $effect(() => {
    if (entry && !populated) {
      date = entry.date
      odometer = entry.odometer != null ? String(entry.odometer) : ''
      type = entry.type
      title = entry.title
      description = entry.description ?? ''
      cost = entry.cost != null ? String(entry.cost) : ''
      populated = true
    }
  })

  async function handleSave() {
    const newErrors: typeof errors = {}
    if (!date) newErrors.date = 'Date is required'
    if (!type) newErrors.type = 'Type is required'
    if (!title.trim()) newErrors.title = 'Title is required'
    if (Object.keys(newErrors).length > 0) { errors = newErrors; return }

    saving = true
    saveError = ''
    try {
      await updateLogEntry(id, {
        date,
        type: type as LogType,
        title: title.trim(),
        odometer: odometer ? Number(odometer) : null,
        cost: cost ? Number(cost) : null,
        description: description.trim() || null,
      })
      navigate(`/log/${id}`)
    } catch (e) {
      saveError = e instanceof Error ? e.message : 'Failed to save. Please try again.'
    } finally {
      saving = false
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
    </div>

    {#if saveError}
      <p class="text-xs text-destructive">{saveError}</p>
    {/if}

    <!-- Actions -->
    <div class="flex justify-end gap-2 pt-1">
      <button
        onclick={() => navigate(`/log/${id}`)}
        disabled={saving}
        class="hidden sm:block px-4 py-2 text-sm font-medium border border-border text-muted-foreground rounded-md hover:text-foreground transition-colors disabled:opacity-50"
      >
        Cancel
      </button>
      <button
        onclick={handleSave}
        disabled={saving}
        class="w-full sm:w-auto px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary-hover transition-colors disabled:opacity-50"
      >
        {saving ? 'Saving…' : 'Save changes'}
      </button>
    </div>
  {/if}
</div>
