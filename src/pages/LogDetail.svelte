<script lang="ts">
  import { ArrowLeft, Paperclip, Trash2 } from 'lucide-svelte'
  import { logEntries, removeLogEntry } from '@/stores/app'
  import { navigate } from '@/lib/router'
  import { cn } from '@/lib/utils'
  import { TYPE_BADGE, formatDate, formatDateTime, capitalize } from '@/lib/log'

  let { id }: { id: string } = $props()

  let entry = $derived($logEntries.find(e => e.id === id) ?? null)
  let confirming = $state(false)
  let deleting = $state(false)

  async function handleDelete() {
    if (!confirming) {
      confirming = true
      return
    }
    deleting = true
    await removeLogEntry(id)
    navigate('/')
  }
</script>

<div class="p-4 space-y-4">
  <!-- Header -->
  <div class="flex items-center justify-between">
    <div class="flex items-center gap-3">
      <button
        onclick={() => navigate('/')}
        class="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
        aria-label="Back"
      >
        <ArrowLeft size={18} />
      </button>
      <h1 class="text-lg font-semibold text-foreground">Log detail</h1>
    </div>

    {#if entry}
      <div class="flex items-center gap-2">
        {#if confirming}
          <span class="text-xs text-muted-foreground">Remove this entry?</span>
          <button
            onclick={() => (confirming = false)}
            class="px-3 py-1.5 text-xs font-medium border border-border text-muted-foreground rounded-md hover:text-foreground transition-colors"
          >
            Cancel
          </button>
        {/if}
        <button
          onclick={handleDelete}
          disabled={deleting}
          class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors disabled:opacity-50 {confirming
            ? 'bg-destructive text-white hover:bg-error-hover'
            : 'border border-border text-muted-foreground hover:text-destructive hover:border-destructive'}"
        >
          <Trash2 size={13} />
          {confirming ? 'Confirm' : 'Remove'}
        </button>
      </div>
    {/if}
  </div>

  {#if !entry}
    <div class="py-16 text-center">
      <p class="text-muted-foreground">Entry not found.</p>
    </div>
  {:else}
    <div class="rounded-xl bg-card border border-border p-4 space-y-4">
      <!-- Type + date -->
      <div class="flex items-center justify-between gap-2">
        <span class={cn('text-xs px-2 py-0.5 rounded-full font-medium', TYPE_BADGE[entry.type])}>
          {capitalize(entry.type)}
        </span>
        <span class="text-xs text-muted-foreground">{formatDate(entry.date)}</span>
      </div>

      <!-- Entry datetime -->
      <p class="text-xs text-muted-foreground">Saved on {formatDateTime(entry.created_at)}</p>

      <!-- Title -->
      <p class="text-base font-semibold text-foreground">{entry.title}</p>

      <!-- Stats row -->
      {#if entry.odometer != null || entry.cost != null}
        <div class="flex gap-6">
          {#if entry.odometer != null}
            <div class="space-y-0.5">
              <p class="text-xs text-muted-foreground">Odometer</p>
              <p class="text-sm font-medium text-foreground">{entry.odometer.toLocaleString()} km</p>
            </div>
          {/if}
          {#if entry.cost != null}
            <div class="space-y-0.5">
              <p class="text-xs text-muted-foreground">Cost</p>
              <p class="text-sm font-medium text-foreground">฿{entry.cost.toLocaleString()}</p>
            </div>
          {/if}
        </div>
      {/if}

      <!-- Notes -->
      {#if entry.description}
        <div class="space-y-1">
          <p class="text-xs text-muted-foreground">Notes</p>
          <p class="text-sm text-foreground whitespace-pre-wrap">{entry.description}</p>
        </div>
      {/if}

      <!-- Attachment -->
      {#if entry.attachment_url}
        <div class="space-y-1">
          <p class="text-xs text-muted-foreground">Attachment</p>
          <a
            href={entry.attachment_url}
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-2 text-sm text-primary hover:underline"
          >
            <Paperclip size={14} />
            View attachment
          </a>
        </div>
      {/if}
    </div>
  {/if}
</div>
