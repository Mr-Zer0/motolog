import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  deleteDoc,
  query,
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

export async function initDatabase(): Promise<void> {
  // Firestore initialisation is handled at module level in firebase.ts
}

export async function readBike(): Promise<Bike> {
  const snap = await getDoc(doc(db, 'bike', 'default'))
  if (!snap.exists()) return { ...DEFAULT_BIKE }
  return snap.data() as Bike
}

export async function writeBike(bike: Bike): Promise<void> {
  await setDoc(doc(db, 'bike', 'default'), bike)
}

export async function readLogEntries(): Promise<LogEntry[]> {
  const q = query(collection(db, 'logEntries'), orderBy('date', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<LogEntry, 'id'>) }))
}

const PAGE_SIZE = 20

export async function readLogEntriesPage(
  cursor?: DocumentSnapshot,
): Promise<{ entries: LogEntry[]; lastDoc: DocumentSnapshot | null; hasMore: boolean }> {
  const constraints = cursor
    ? [orderBy('date', 'desc'), startAfter(cursor), limit(PAGE_SIZE + 1)]
    : [orderBy('date', 'desc'), limit(PAGE_SIZE + 1)]
  const snap = await getDocs(query(collection(db, 'logEntries'), ...constraints))
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
