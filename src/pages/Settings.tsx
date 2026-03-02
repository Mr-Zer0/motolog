import { useState } from 'react'
import { useApp } from '@/context/AppContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
}

export default function Settings() {
  const { bike, saveBike } = useApp()
  const [form, setForm] = useState<Bike>(bike ?? emptyBike)
  const [nameError, setNameError] = useState('')
  const [saved, setSaved] = useState(false)

  function handleChange(field: keyof Bike, value: string) {
    setForm(prev => ({
      ...prev,
      [field]:
        field === 'year' || field === 'current_odometer'
          ? value === ''
            ? null
            : Number(value)
          : value,
    }))
    if (field === 'name') setNameError('')
  }

  async function handleSave() {
    if (!form.name.trim()) {
      setNameError('Bike name is required')
      return
    }
    await saveBike(form)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-xl font-bold text-foreground">Settings</h1>

      {/* Bike information */}
      <section className="space-y-3">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Bike Information
        </h2>
        <div className="rounded-xl bg-card border border-border p-4 space-y-3">
          <div className="space-y-1">
            <Label htmlFor="bike-name">Bike name *</Label>
            <Input
              id="bike-name"
              value={form.name}
              onChange={e => handleChange('name', e.target.value)}
              placeholder="e.g. My Filano"
              className={nameError ? 'border-destructive' : ''}
            />
            {nameError && <p className="text-xs text-destructive">{nameError}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="bike-brand">Brand</Label>
              <Input
                id="bike-brand"
                value={form.brand}
                onChange={e => handleChange('brand', e.target.value)}
                placeholder="e.g. Yamaha"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="bike-model">Model</Label>
              <Input
                id="bike-model"
                value={form.model}
                onChange={e => handleChange('model', e.target.value)}
                placeholder="e.g. Grand Filano"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="bike-year">Year</Label>
              <Input
                id="bike-year"
                type="number"
                value={form.year ?? ''}
                onChange={e => handleChange('year', e.target.value)}
                placeholder="e.g. 2025"
                min={1900}
                max={2100}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="bike-color">Color</Label>
              <Input
                id="bike-color"
                value={form.color}
                onChange={e => handleChange('color', e.target.value)}
                placeholder="e.g. Pearl White"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="bike-plate">License plate</Label>
              <Input
                id="bike-plate"
                value={form.plate_number}
                onChange={e => handleChange('plate_number', e.target.value)}
                placeholder="e.g. กข 1234"
              />
            </div>
            <div className="space-y-1">
              <Label>Engine type</Label>
              <Select
                value={form.engine_type}
                onValueChange={v => handleChange('engine_type', v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ICE">ICE</SelectItem>
                  <SelectItem value="EV">EV</SelectItem>
                  <SelectItem value="Hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="bike-vin">VIN</Label>
            <Input
              id="bike-vin"
              value={form.vin}
              onChange={e => handleChange('vin', e.target.value)}
              placeholder="e.g. ME1SG4310P0123456"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="bike-odo">Current odometer (km)</Label>
            <Input
              id="bike-odo"
              type="number"
              value={form.current_odometer ?? ''}
              onChange={e => handleChange('current_odometer', e.target.value)}
              placeholder="e.g. 2800"
              min={0}
            />
          </div>

          <div className="flex items-center gap-3 pt-1">
            <Button onClick={handleSave}>Save</Button>
            {saved && <span className="text-sm text-success">Saved successfully</span>}
          </div>
        </div>
      </section>

      {/* Data & backup */}
      <section className="space-y-3">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Data & Backup
        </h2>
        <div className="rounded-xl bg-card border border-border p-4 space-y-4">
          <p className="text-sm text-muted-foreground">
            All data is stored locally in your browser. Export your data periodically to keep a
            backup.
          </p>
          <div className="flex gap-3">
            <Button variant="outline" size="sm">
              Export data
            </Button>
            <Button variant="outline" size="sm">
              Import data
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
