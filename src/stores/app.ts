import { writable } from 'svelte/store'
import type { DocumentSnapshot } from 'firebase/firestore'
import type { Bike, LogEntry } from '@/types'
import { readBike, writeBike, readLogEntriesPage, insertLogEntry, deleteLogEntry } from '@/db/database'

export const isReady = writable(false)
export const bike = writable<Bike | null>(null)
export const logEntries = writable<LogEntry[]>([])
export const hasMore = writable(false)
export const loadingMore = writable(false)

let lastDoc: DocumentSnapshot | null = null

export async function initApp() {
  const [bikeData, page] = await Promise.all([readBike(), readLogEntriesPage()])
  bike.set(bikeData)
  logEntries.set(page.entries)
  lastDoc = page.lastDoc
  hasMore.set(page.hasMore)
  isReady.set(true)
}

export async function loadMoreEntries() {
  if (!lastDoc) return
  loadingMore.set(true)
  try {
    const page = await readLogEntriesPage(lastDoc)
    logEntries.update(entries => [...entries, ...page.entries])
    lastDoc = page.lastDoc
    hasMore.set(page.hasMore)
  } finally {
    loadingMore.set(false)
  }
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
