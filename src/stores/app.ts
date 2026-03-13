import { writable } from 'svelte/store'
import type { Bike, LogEntry } from '@/types'
import { readBike, writeBike, readLogEntries, insertLogEntry, deleteLogEntry } from '@/db/database'

export const isReady = writable(false)
export const bike = writable<Bike | null>(null)
export const logEntries = writable<LogEntry[]>([])

export async function initApp() {
  const [bikeData, entries] = await Promise.all([readBike(), readLogEntries()])
  bike.set(bikeData)
  logEntries.set(entries)
  isReady.set(true)
}

export async function saveBike(bikeData: Bike) {
  await writeBike(bikeData)
  bike.set(bikeData)
}

export async function addLogEntry(entry: Omit<LogEntry, 'id' | 'created_at'>) {
  const inserted = await insertLogEntry({ ...entry, created_at: new Date().toISOString() })
  logEntries.update(entries => [inserted, ...entries])
}

export async function removeLogEntry(id: string) {
  await deleteLogEntry(id)
  logEntries.update(entries => entries.filter(e => e.id !== id))
}
