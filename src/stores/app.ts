import { writable } from 'svelte/store'
import type { Bike, LogEntry } from '@/types'
import { readBike, writeBike, readLogEntries, insertLogEntry } from '@/db/database'

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

export async function addLogEntry(entry: Omit<LogEntry, 'id'>) {
  const inserted = await insertLogEntry(entry)
  logEntries.update(entries => [inserted, ...entries])
}
