import {
  collection,
  doc,
  getDoc,
  getDocFromCache,
  getDocs,
  getDocsFromCache,
  setDoc,
  addDoc,
  deleteDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  type DocumentSnapshot,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { Bike, LogEntry } from '@/types'

const DEFAULT_BIKE: Bike = {
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

const PAGE_SIZE = 20

function get60DayCutoff(): string {
  const d = new Date()
  d.setDate(d.getDate() - 60)
  return d.toISOString().split('T')[0]
}

export async function initDatabase(): Promise<void> {
  // Firestore initialisation is handled at module level in firebase.ts
}

export async function readBike(): Promise<Bike> {
  const snap = await getDoc(doc(db, 'bike', 'default'))
  if (!snap.exists()) return { ...DEFAULT_BIKE }
  return snap.data() as Bike
}

export async function readBikeFromCache(): Promise<Bike> {
  const snap = await getDocFromCache(doc(db, 'bike', 'default'))
  if (!snap.exists()) return { ...DEFAULT_BIKE }
  return snap.data() as Bike
}

export async function writeBike(bike: Bike): Promise<void> {
  await setDoc(doc(db, 'bike', 'default'), bike)
}

// Fetch last 60 days of entries — used for initial load
export async function readRecentLogEntries(): Promise<{
  entries: LogEntry[]
  lastDoc: DocumentSnapshot | null
}> {
  const snap = await getDocs(
    query(
      collection(db, 'logEntries'),
      where('date', '>=', get60DayCutoff()),
      orderBy('date', 'desc'),
    ),
  )
  const docs = snap.docs
  return {
    entries: docs.map(d => ({ id: d.id, ...(d.data() as Omit<LogEntry, 'id'>) })),
    lastDoc: docs[docs.length - 1] ?? null,
  }
}

export async function readRecentLogEntriesFromCache(): Promise<{
  entries: LogEntry[]
  lastDoc: DocumentSnapshot | null
}> {
  const snap = await getDocsFromCache(
    query(
      collection(db, 'logEntries'),
      where('date', '>=', get60DayCutoff()),
      orderBy('date', 'desc'),
    ),
  )
  const docs = snap.docs
  return {
    entries: docs.map(d => ({ id: d.id, ...(d.data() as Omit<LogEntry, 'id'>) })),
    lastDoc: docs[docs.length - 1] ?? null,
  }
}

// Fetch older entries beyond the cursor — used for load more
export async function readLogEntriesPage(cursor: DocumentSnapshot): Promise<{
  entries: LogEntry[]
  lastDoc: DocumentSnapshot | null
  hasMore: boolean
}> {
  const snap = await getDocs(
    query(
      collection(db, 'logEntries'),
      orderBy('date', 'desc'),
      startAfter(cursor),
      limit(PAGE_SIZE + 1),
    ),
  )
  const hasMore = snap.docs.length > PAGE_SIZE
  const docs = hasMore ? snap.docs.slice(0, PAGE_SIZE) : snap.docs
  return {
    entries: docs.map(d => ({ id: d.id, ...(d.data() as Omit<LogEntry, 'id'>) })),
    lastDoc: docs[docs.length - 1] ?? null,
    hasMore,
  }
}

export async function readLogEntriesPageFromCache(cursor: DocumentSnapshot): Promise<{
  entries: LogEntry[]
  lastDoc: DocumentSnapshot | null
  hasMore: boolean
}> {
  const snap = await getDocsFromCache(
    query(
      collection(db, 'logEntries'),
      orderBy('date', 'desc'),
      startAfter(cursor),
      limit(PAGE_SIZE + 1),
    ),
  )
  const hasMore = snap.docs.length > PAGE_SIZE
  const docs = hasMore ? snap.docs.slice(0, PAGE_SIZE) : snap.docs
  return {
    entries: docs.map(d => ({ id: d.id, ...(d.data() as Omit<LogEntry, 'id'>) })),
    lastDoc: docs[docs.length - 1] ?? null,
    hasMore,
  }
}

export async function insertLogEntry(entry: Omit<LogEntry, 'id'>): Promise<LogEntry> {
  const ref = await addDoc(collection(db, 'logEntries'), entry)
  return { ...entry, id: ref.id }
}

export async function deleteLogEntry(id: string): Promise<void> {
  await deleteDoc(doc(db, 'logEntries', id))
}

export async function updateLogEntry(id: string, updates: Partial<Omit<LogEntry, 'id' | 'created_at'>>): Promise<void> {
  await updateDoc(doc(db, 'logEntries', id), updates)
}
