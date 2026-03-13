<script lang="ts">
  import { bike, saveBike } from '@/stores/app'
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
  <h1 class="text-xl font-bold text-foreground">Settings</h1>

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
          class="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary-hover transition-colors"
        >
          Save
        </button>
        {#if saved}
          <span class="text-sm text-success">Saved successfully</span>
        {/if}
      </div>
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
