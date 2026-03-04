import { useState } from 'react'
import { Paperclip } from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { Button } from '@/components/ui/button'
import NewLogModal from '@/components/NewLogModal'
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

export default function Home() {
  const { bike, logEntries } = useApp()
  const [typeFilter, setTypeFilter] = useState<LogType | 'all'>('all')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [modalOpen, setModalOpen] = useState(false)

  const filtered = logEntries
    .filter(e => typeFilter === 'all' || e.type === typeFilter)
    .filter(e => !dateFrom || e.date >= dateFrom)
    .filter(e => !dateTo || e.date <= dateTo)
    .sort((a, b) => b.date.localeCompare(a.date))

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-foreground">
            {bike?.name || 'Your bike'}
          </h1>
          <p className="text-sm text-muted-foreground">Maintenance & modification log</p>
        </div>
        <Button onClick={() => setModalOpen(true)} size="sm" className="shrink-0">
          + New log entry
        </Button>
      </div>

      {/* Filters */}
      <div className="space-y-2">
        <div className="flex flex-wrap gap-1.5">
          {TYPE_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => setTypeFilter(opt.value)}
              className={cn(
                'px-3 py-1 rounded-full text-xs font-medium border transition-colors',
                typeFilter === opt.value
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'border-border text-muted-foreground hover:text-foreground',
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={dateFrom}
            onChange={e => setDateFrom(e.target.value)}
            className="flex-1 bg-input border border-border rounded-md px-3 py-1.5 text-xs text-foreground"
          />
          <span className="text-xs text-muted-foreground">to</span>
          <input
            type="date"
            value={dateTo}
            onChange={e => setDateTo(e.target.value)}
            className="flex-1 bg-input border border-border rounded-md px-3 py-1.5 text-xs text-foreground"
          />
        </div>
      </div>

      {/* Log list or empty state */}
      {filtered.length === 0 ? (
        <div className="py-16 text-center space-y-3">
          <p className="text-muted-foreground">
            {logEntries.length === 0 ? 'No logs yet' : 'No matching logs'}
          </p>
          {logEntries.length === 0 && (
            <Button onClick={() => setModalOpen(true)} variant="outline" size="sm">
              + New log entry
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(entry => (
            <div
              key={entry.id}
              className="rounded-xl bg-card border border-border p-3 space-y-1.5"
            >
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    'text-xs px-2 py-0.5 rounded-full font-medium',
                    TYPE_BADGE[entry.type],
                  )}
                >
                  {entry.type.charAt(0).toUpperCase() + entry.type.slice(1)}
                </span>
                <div className="flex items-center gap-2 ml-auto">
                  {entry.has_attachment && (
                    <Paperclip size={12} className="text-muted-foreground" />
                  )}
                  <span className="text-xs text-muted-foreground">{formatDate(entry.date)}</span>
                </div>
              </div>
              <p className="text-sm font-medium text-foreground">{entry.title}</p>
              <div className="flex gap-4 text-xs text-muted-foreground">
                {entry.odometer != null && (
                  <span>{entry.odometer.toLocaleString()} km</span>
                )}
                {entry.cost != null && <span>฿{entry.cost.toLocaleString()}</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      <NewLogModal open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  )
}
