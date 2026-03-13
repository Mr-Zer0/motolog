<script lang="ts">
  import { Paperclip } from 'lucide-svelte'
  import { bike, logEntries } from '@/stores/app'
  import { newLogModalOpen } from '@/stores/ui'
  import { cn } from '@/lib/utils'
  import type { LogType } from '@/types'

  const TYPE_OPTIONS: Array<{ value: LogType | 'all'; label: string }> = [
    { value: 'all', label: 'All' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'modification', label: 'Modification' },
    { value: 'repair', label: 'Repair' },
    { value: 'fuel', label: 'Fuel' },
    { value: 'inspection', label: 'Inspection' },
    { value: 'cleaning', label: 'Cleaning' },
    { value: 'other', label: 'Other' },
  ]

  const TYPE_BADGE: Record<LogType, string> = {
    maintenance: 'bg-blue-950 text-blue-300 border border-blue-800',
    modification: 'bg-violet-950 text-violet-300 border border-violet-800',
    repair: 'bg-amber-950 text-amber-300 border border-amber-800',
    fuel: 'bg-emerald-950 text-emerald-300 border border-emerald-800',
    inspection: 'bg-cyan-950 text-cyan-300 border border-cyan-800',
    cleaning: 'bg-teal-950 text-teal-300 border border-teal-800',
    other: 'bg-slate-800 text-slate-300 border border-slate-700',
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  let typeFilter = $state<LogType | 'all'>('all')
  let dateFrom = $state('')
  let dateTo = $state('')

  let filtered = $derived(
    $logEntries
      .filter(e => typeFilter === 'all' || e.type === typeFilter)
      .filter(e => !dateFrom || e.date >= dateFrom)
      .filter(e => !dateTo || e.date <= dateTo)
      .sort((a, b) => b.date.localeCompare(a.date)),
  )
</script>

<div class="p-4 space-y-4">
  <!-- Header -->
  <div class="flex items-start justify-between gap-4">
    <div>
      <h1 class="text-xl font-bold text-foreground">{$bike?.name || 'Your bike'}</h1>
      <p class="text-sm text-muted-foreground">Maintenance & modification log</p>
    </div>
    <button
      onclick={() => newLogModalOpen.set(true)}
      class="hidden sm:block shrink-0 px-3 py-1.5 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary-hover transition-colors"
    >
      + New log entry
    </button>
  </div>

  <!-- Filters -->
  <div class="space-y-2">
    <div class="flex flex-wrap gap-1.5">
      {#each TYPE_OPTIONS as opt (opt.value)}
        <button
          onclick={() => (typeFilter = opt.value)}
          class={cn(
            'px-3 py-1 rounded-full text-xs font-medium border transition-colors',
            typeFilter === opt.value
              ? 'bg-primary text-primary-foreground border-primary'
              : 'border-border text-muted-foreground hover:text-foreground',
          )}
        >
          {opt.label}
        </button>
      {/each}
    </div>
    <div class="flex items-center gap-2">
      <input
        type="date"
        bind:value={dateFrom}
        class="flex-1 bg-input border border-border rounded-md px-3 py-1.5 text-xs text-foreground"
      />
      <span class="text-xs text-muted-foreground">to</span>
      <input
        type="date"
        bind:value={dateTo}
        class="flex-1 bg-input border border-border rounded-md px-3 py-1.5 text-xs text-foreground"
      />
    </div>
  </div>

  <!-- Log list or empty state -->
  {#if filtered.length === 0}
    <div class="py-16 text-center space-y-3">
      <p class="text-muted-foreground">
        {$logEntries.length === 0 ? 'No logs yet' : 'No matching logs'}
      </p>
      {#if $logEntries.length === 0}
        <button
          onclick={() => newLogModalOpen.set(true)}
          class="px-3 py-1.5 text-sm font-medium border border-border text-muted-foreground rounded-md hover:text-foreground transition-colors"
        >
          + New log entry
        </button>
      {/if}
    </div>
  {:else}
    <div class="space-y-2">
      {#each filtered as entry (entry.id)}
        <div class="rounded-xl bg-card border border-border p-3 space-y-1.5">
          <div class="flex items-center gap-2">
            <span class={cn('text-xs px-2 py-0.5 rounded-full font-medium', TYPE_BADGE[entry.type])}>
              {entry.type.charAt(0).toUpperCase() + entry.type.slice(1)}
            </span>
            <div class="flex items-center gap-2 ml-auto">
              {#if entry.has_attachment}
                <Paperclip size={12} class="text-muted-foreground" />
              {/if}
              <span class="text-xs text-muted-foreground">{formatDate(entry.date)}</span>
            </div>
          </div>
          <p class="text-sm font-medium text-foreground">{entry.title}</p>
          <div class="flex gap-4 text-xs text-muted-foreground">
            {#if entry.odometer != null}
              <span>{entry.odometer.toLocaleString()} km</span>
            {/if}
            {#if entry.cost != null}
              <span>฿{entry.cost.toLocaleString()}</span>
            {/if}
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>
