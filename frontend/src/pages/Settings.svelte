<script lang="ts">
  import { ArrowLeft, LogOut, RefreshCw } from 'lucide-svelte'
  import { bike, saveBike, syncNow } from '@/stores/app'
  import { navigate } from '@/lib/router'
  import { currentUser, signOut } from '@/stores/auth'
  import type { Bike } from '@/types'

  const emptyBike: Bike = {
    name: '',
    brand: '',
    model: '',
    year: null,
    color: '',
    engine_type: 'ICE',
    plate_number: '',
    vin: '',
    current_odometer: null,
    buying_date: null,
  }

  let form = $state<Bike>(structuredClone($bike ?? emptyBike))
  let nameError = $state('')
  let saved = $state(false)

  const LAST_SYNC_KEY = 'motolog_last_sync'
  let syncing = $state(false)
  let syncError = $state('')
  let lastSyncTime = $state(Number(localStorage.getItem(LAST_SYNC_KEY) ?? 0))

  function formatSyncTime(ts: number): string {
    if (!ts) return 'Never'
    return new Date(ts).toLocaleString()
  }

  async function handleSync() {
    syncing = true
    syncError = ''
    try {
      await syncNow()
      lastSyncTime = Number(localStorage.getItem(LAST_SYNC_KEY) ?? 0)
    } catch (e) {
      syncError = e instanceof Error ? e.message : 'Sync failed'
    } finally {
      syncing = false
    }
  }

  function handleChange(field: keyof Bike, value: string) {
    if (field === 'year' || field === 'current_odometer') {
      ;(form as Record<string, unknown>)[field] = value === '' ? null : Number(value)
    } else if (field === 'buying_date') {
      ;(form as Record<string, unknown>)[field] = value === '' ? null : value
    } else {
      ;(form as Record<string, unknown>)[field] = value
    }
    if (field === 'name') nameError = ''
  }

  async function handleSave() {
    if (!form.name.trim()) {
      nameError = 'Bike name is required'
      return
    }
    await saveBike({ ...form })
    saved = true
    setTimeout(() => (saved = false), 2500)
  }

  const inputClass =
    'w-full bg-input border border-border rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background'
  const labelClass = 'text-xs font-medium text-muted-foreground'
</script>

<div class="p-4 space-y-6">
  <!-- Mobile back button header -->
  <div class="sm:hidden flex items-center gap-2 -mx-1">
    <button
      onclick={() => navigate('/')}
      class="p-1.5 rounded-md text-muted-foreground hover:text-foreground transition-colors"
      aria-label="Back"
    >
      <ArrowLeft size={20} />
    </button>
    <h1 class="text-xl font-bold text-foreground">Settings</h1>
  </div>

  <!-- Desktop heading -->
  <h1 class="hidden sm:block text-xl font-bold text-foreground">Settings</h1>

  <!-- Bike information -->
  <section class="space-y-3">
    <h2 class="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
      Bike Information
    </h2>
    <div class="rounded-xl bg-card border border-border p-4 space-y-3">
      <div class="space-y-1">
        <label for="bike-name" class={labelClass}>Bike name *</label>
        <input
          id="bike-name"
          value={form.name}
          oninput={e => handleChange('name', (e.target as HTMLInputElement).value)}
          placeholder="e.g. My Filano"
          class="{inputClass} {nameError ? 'border-destructive' : ''}"
        />
        {#if nameError}
          <p class="text-xs text-destructive">{nameError}</p>
        {/if}
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div class="space-y-1">
          <label for="bike-brand" class={labelClass}>Brand</label>
          <input
            id="bike-brand"
            value={form.brand}
            oninput={e => handleChange('brand', (e.target as HTMLInputElement).value)}
            placeholder="e.g. Yamaha"
            class={inputClass}
          />
        </div>
        <div class="space-y-1">
          <label for="bike-model" class={labelClass}>Model</label>
          <input
            id="bike-model"
            value={form.model}
            oninput={e => handleChange('model', (e.target as HTMLInputElement).value)}
            placeholder="e.g. Grand Filano"
            class={inputClass}
          />
        </div>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div class="space-y-1">
          <label for="bike-year" class={labelClass}>Year</label>
          <input
            id="bike-year"
            type="number"
            value={form.year ?? ''}
            oninput={e => handleChange('year', (e.target as HTMLInputElement).value)}
            placeholder="e.g. 2025"
            min={1900}
            max={2100}
            class={inputClass}
          />
        </div>
        <div class="space-y-1">
          <label for="bike-color" class={labelClass}>Color</label>
          <input
            id="bike-color"
            value={form.color}
            oninput={e => handleChange('color', (e.target as HTMLInputElement).value)}
            placeholder="e.g. Pearl White"
            class={inputClass}
          />
        </div>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div class="space-y-1">
          <label for="bike-plate" class={labelClass}>License plate</label>
          <input
            id="bike-plate"
            value={form.plate_number}
            oninput={e => handleChange('plate_number', (e.target as HTMLInputElement).value)}
            placeholder="e.g. กข 1234"
            class={inputClass}
          />
        </div>
        <div class="space-y-1">
          <label for="bike-engine" class={labelClass}>Engine type</label>
          <select
            id="bike-engine"
            value={form.engine_type}
            onchange={e => handleChange('engine_type', (e.target as HTMLSelectElement).value)}
            class="w-full bg-input border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
          >
            <option value="ICE">ICE</option>
            <option value="EV">EV</option>
            <option value="Hybrid">Hybrid</option>
          </select>
        </div>
      </div>

      <div class="space-y-1">
        <label for="bike-vin" class={labelClass}>VIN</label>
        <input
          id="bike-vin"
          value={form.vin}
          oninput={e => handleChange('vin', (e.target as HTMLInputElement).value)}
          placeholder="e.g. ME1SG4310P0123456"
          class={inputClass}
        />
      </div>

      <div class="space-y-1">
        <label for="bike-odo" class={labelClass}>Current odometer (km)</label>
        <input
          id="bike-odo"
          type="number"
          value={form.current_odometer ?? ''}
          oninput={e => handleChange('current_odometer', (e.target as HTMLInputElement).value)}
          placeholder="e.g. 2800"
          min={0}
          class={inputClass}
        />
      </div>

      <div class="space-y-1">
        <label for="bike-buying-date" class={labelClass}>Buying date</label>
        <input
          id="bike-buying-date"
          type="date"
          value={form.buying_date ?? ''}
          onchange={e => handleChange('buying_date', (e.target as HTMLInputElement).value)}
          class={inputClass}
        />
      </div>

      <div class="flex items-center gap-3 pt-1">
        <button
          onclick={handleSave}
          class="w-full sm:w-auto px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary-hover transition-colors"
        >
          Save
        </button>
        {#if saved}
          <span class="text-sm text-success">Saved successfully</span>
        {/if}
      </div>
    </div>
  </section>

  <!-- Sync -->
  <section class="space-y-3">
    <h2 class="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Sync</h2>
    <div class="rounded-xl bg-card border border-border p-4 space-y-3">
      <p class="text-sm text-muted-foreground">
        Last synced: <span class="text-foreground">{formatSyncTime(lastSyncTime)}</span>
      </p>
      <div class="flex items-center gap-3">
        <button
          onclick={handleSync}
          disabled={syncing}
          class="flex items-center gap-2 px-3 py-1.5 text-sm font-medium border border-border text-muted-foreground rounded-md hover:text-foreground transition-colors disabled:opacity-50"
        >
          <RefreshCw size={14} class={syncing ? 'animate-spin' : ''} />
          {syncing ? 'Syncing…' : 'Sync now'}
        </button>
        {#if syncError}
          <span class="text-sm text-destructive">{syncError}</span>
        {/if}
      </div>
    </div>
  </section>

  <!-- Account (mobile only) -->
  <section class="sm:hidden space-y-3">
    <h2 class="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Account</h2>
    <div class="rounded-xl bg-card border border-border p-4 space-y-3">
      {#if $currentUser}
        <div class="flex items-center gap-3">
          {#if $currentUser.photoURL}
            <img src={$currentUser.photoURL} alt="avatar" class="w-9 h-9 rounded-full" />
          {/if}
          <div class="min-w-0">
            {#if $currentUser.displayName}
              <p class="text-sm font-medium text-foreground truncate">{$currentUser.displayName}</p>
            {/if}
            <p class="text-xs text-muted-foreground truncate">{$currentUser.email}</p>
          </div>
        </div>
      {/if}
      <button
        onclick={signOut}
        class="flex items-center gap-2 w-full px-3 py-2 text-sm font-medium text-destructive border border-destructive/40 rounded-md hover:bg-destructive/10 transition-colors"
      >
        <LogOut size={15} />
        Sign out
      </button>
    </div>
  </section>

  <!-- Data & backup -->
  <section class="space-y-3">
    <h2 class="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
      Data & Backup
    </h2>
    <div class="rounded-xl bg-card border border-border p-4 space-y-4">
      <p class="text-sm text-muted-foreground">
        All data is stored locally in your browser. Export your data periodically to keep a backup.
      </p>
      <div class="flex gap-3">
        <button
          class="px-3 py-1.5 text-sm font-medium border border-border text-muted-foreground rounded-md hover:text-foreground transition-colors"
        >
          Export data
        </button>
        <button
          class="px-3 py-1.5 text-sm font-medium border border-border text-muted-foreground rounded-md hover:text-foreground transition-colors"
        >
          Import data
        </button>
      </div>
    </div>
  </section>
</div>
