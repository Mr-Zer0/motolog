import type { LogType } from '@/types'

export const TYPE_BADGE: Record<LogType, string> = {
  maintenance: 'bg-blue-950 text-blue-300 border border-blue-800',
  modification: 'bg-violet-950 text-violet-300 border border-violet-800',
  repair: 'bg-amber-950 text-amber-300 border border-amber-800',
  fuel: 'bg-emerald-950 text-emerald-300 border border-emerald-800',
  inspection: 'bg-cyan-950 text-cyan-300 border border-cyan-800',
  cleaning: 'bg-teal-950 text-teal-300 border border-teal-800',
  other: 'bg-slate-800 text-slate-300 border border-slate-700',
}

export function formatDate(dateStr: string) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function formatDateTime(isoStr: string) {
  return new Date(isoStr).toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
