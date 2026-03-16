<script lang="ts">
  import { Paperclip, SlidersHorizontal, ChevronDown } from 'lucide-svelte'
  import { slide } from 'svelte/transition'
  import { bike, logEntries } from '@/stores/app'
  import { navigate } from '@/lib/router'
  import { cn } from '@/lib/utils'
  import { TYPE_BADGE, formatDate, capitalize } from '@/lib/log'
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

  let typeFilter = $state<LogType | 'all'>('all')
  let dateFrom = $state('')
  let dateTo = $state('')
  let filterOpen = $state(false)

  let isFiltered = $derived(typeFilter !== 'all' || !!dateFrom || !!dateTo)

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
    <div class="flex-1 rounded-xl bg-card border border-border p-4 space-y-1.5">
      <div class="flex items-start justify-between gap-2">
        <h1 class="text-xl font-bold text-foreground">{$bike?.name || 'Your bike'}</h1>
        {#if $bike?.year}
          <span class="text-sm text-muted-foreground shrink-0">{$bike.year}</span>
        {/if}
      </div>
      {#if $bike?.plate_number}
        <span class="inline-block px-2 py-0.5 text-xs font-medium rounded border border-amber-500/40 bg-amber-500/10 text-amber-400">{$bike.plate_number}</span>
      {/if}
      {#if $bike?.brand || $bike?.model}
        <div class="flex gap-2 mt-2">
          {#if $bike?.brand}
            <div class="flex-1 rounded-md bg-input px-3 py-1.5">
              <p class="text-xs text-muted-foreground">Brand</p>
              <p class="text-sm font-medium text-foreground">{$bike.brand}</p>
            </div>
          {/if}
          {#if $bike?.model}
            <div class="flex-1 rounded-md bg-input px-3 py-1.5">
              <p class="text-xs text-muted-foreground">Model</p>
              <p class="text-sm font-medium text-foreground">{$bike.model}</p>
            </div>
          {/if}
        </div>
      {/if}
    </div>
    <button
      onclick={() => navigate('/new')}
      class="hidden sm:block shrink-0 px-3 py-1.5 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary-hover transition-colors"
    >
      + New log entry
    </button>
  </div>

  <!-- Filters -->
  <div class="space-y-2">
    <button
      onclick={() => (filterOpen = !filterOpen)}
      class="flex items-center gap-2 px-3 py-1.5 rounded-md border transition-colors text-sm font-medium
        {isFiltered
          ? 'border-primary bg-primary/10 text-primary'
          : 'border-border text-muted-foreground hover:text-foreground'}"
    >
      <SlidersHorizontal size={14} />
      Filter
      {#if isFiltered && typeFilter !== 'all'}
        <span class="text-xs">· {capitalize(typeFilter)}</span>
      {/if}
      <ChevronDown size={14} class="ml-auto transition-transform duration-200 {filterOpen ? 'rotate-180' : ''}" />
    </button>

    {#if filterOpen}
      <div transition:slide={{ duration: 200 }} class="space-y-2 rounded-xl bg-card border border-border p-3">
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
    {/if}
  </div>

  <!-- Log list or empty state -->
  {#if filtered.length === 0}
    <div class="py-16 text-center space-y-3">
      <p class="text-muted-foreground">
        {$logEntries.length === 0 ? 'No logs yet' : 'No matching logs'}
      </p>
      {#if $logEntries.length === 0}
        <button
          onclick={() => navigate('/new')}
          class="px-3 py-1.5 text-sm font-medium border border-border text-muted-foreground rounded-md hover:text-foreground transition-colors"
        >
          + New log entry
        </button>
      {/if}
    </div>
  {:else}
    <div class="space-y-2">
      {#each filtered as entry (entry.id)}
        <button
          onclick={() => navigate(`/log/${entry.id}`)}
          class="w-full text-left rounded-xl bg-card border border-border p-3 space-y-1.5 hover:border-primary/50 transition-colors"
        >
          <div class="flex items-center gap-2">
            <span class={cn('text-xs px-2 py-0.5 rounded-full font-medium', TYPE_BADGE[entry.type])}>
              {capitalize(entry.type)}
            </span>
            <div class="flex items-center gap-2 ml-auto">
              {#if entry.attachment_url}
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
        </button>
      {/each}
    </div>
  {/if}
</div>
