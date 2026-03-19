import { writable } from 'svelte/store'
import type { DocumentSnapshot } from 'firebase/firestore'
import type { Bike, LogEntry } from '@/types'
import {
  readBike,
  readBikeFromCache,
  writeBike,
  readRecentLogEntries,
  readRecentLogEntriesFromCache,
  readLogEntriesPage,
  readLogEntriesPageFromCache,
  insertLogEntry,
  deleteLogEntry,
  updateLogEntry as dbUpdateLogEntry,
} from '@/db/database'

export const isReady = writable(false)
export const bike = writable<Bike | null>(null)
export const logEntries = writable<LogEntry[]>([])
export const hasMore = writable(false)
export const loadingMore = writable(false)

const LAST_SYNC_KEY = 'motolog_last_sync'

let lastDoc: DocumentSnapshot | null = null

async function _syncFromNetwork() {
  const [bikeData, recent] = await Promise.all([readBike(), readRecentLogEntries()])
  bike.set(bikeData)
  logEntries.set(recent.entries)
  lastDoc = recent.lastDoc
  hasMore.set(lastDoc !== null)
  localStorage.setItem(LAST_SYNC_KEY, String(Date.now()))
}

export async function initApp() {
  try {
    const [bikeData, recent] = await Promise.all([
      readBikeFromCache(),
      readRecentLogEntriesFromCache(),
    ])
    bike.set(bikeData)
    logEntries.set(recent.entries)
    lastDoc = recent.lastDoc
    hasMore.set(lastDoc !== null)
    isReady.set(true)
  } catch {
    // Cache miss (first load or cleared cache) — load from network
    await _syncFromNetwork()
    isReady.set(true)
  }
}

export async function syncNow() {
  await _syncFromNetwork()
}

export async function loadMoreEntries() {
  if (!lastDoc) return
  loadingMore.set(true)
  try {
    let page: Awaited<ReturnType<typeof readLogEntriesPage>>
    try {
      page = await readLogEntriesPageFromCache(lastDoc)
    } catch {
      page = await readLogEntriesPage(lastDoc)
    }
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

export async function updateLogEntry(id: string, updates: Partial<Omit<LogEntry, 'id' | 'created_at'>>) {
  await dbUpdateLogEntry(id, updates)
  logEntries.update(entries => entries.map(e => e.id === id ? { ...e, ...updates } : e))
}
