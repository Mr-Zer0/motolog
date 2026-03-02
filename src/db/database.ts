import initSqlJs from 'sql.js'
import type { Database } from 'sql.js'
import type { Bike, LogEntry } from '@/types'

const IDB_NAME = 'motolog'
const IDB_STORE = 'sqlite'
const IDB_KEY = 'db'

let db: Database

// ── IndexedDB helpers ──────────────────────────────────────────────────────────

function openIdb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(IDB_NAME, 1)
    req.onupgradeneeded = () => req.result.createObjectStore(IDB_STORE)
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

async function loadFromIdb(): Promise<Uint8Array | null> {
  const idb = await openIdb()
  return new Promise((resolve, reject) => {
    const tx = idb.transaction(IDB_STORE, 'readonly')
    const req = tx.objectStore(IDB_STORE).get(IDB_KEY)
    req.onsuccess = () => resolve(req.result ?? null)
    req.onerror = () => reject(req.error)
    tx.oncomplete = () => idb.close()
  })
}

async function saveToIdb(data: Uint8Array): Promise<void> {
  const idb = await openIdb()
  return new Promise((resolve, reject) => {
    const tx = idb.transaction(IDB_STORE, 'readwrite')
    tx.objectStore(IDB_STORE).put(data, IDB_KEY)
    tx.oncomplete = () => {
      idb.close()
      resolve()
    }
    tx.onerror = () => reject(tx.error)
  })
}

// ── Schema ─────────────────────────────────────────────────────────────────────

const SCHEMA = `
CREATE TABLE IF NOT EXISTS bike (
  id INTEGER PRIMARY KEY DEFAULT 1,
  name TEXT NOT NULL DEFAULT '',
  brand TEXT NOT NULL DEFAULT '',
  model TEXT NOT NULL DEFAULT '',
  year INTEGER,
  color TEXT NOT NULL DEFAULT '',
  engine_type TEXT NOT NULL DEFAULT 'ICE',
  plate_number TEXT NOT NULL DEFAULT '',
  vin TEXT NOT NULL DEFAULT '',
  current_odometer INTEGER
);
INSERT OR IGNORE INTO bike (id) VALUES (1);

CREATE TABLE IF NOT EXISTS log_entry (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date TEXT NOT NULL,
  odometer INTEGER,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  cost REAL,
  has_attachment INTEGER NOT NULL DEFAULT 0
);
`

// ── Persist ────────────────────────────────────────────────────────────────────

async function persist(): Promise<void> {
  await saveToIdb(db.export())
}

// ── Public API ─────────────────────────────────────────────────────────────────

export async function initDatabase(): Promise<void> {
  const SQL = await initSqlJs({
    locateFile: (file: string) => `https://sql.js.org/dist/${file}`,
  })

  const saved = await loadFromIdb()
  db = saved ? new SQL.Database(saved) : new SQL.Database()
  db.run(SCHEMA)

  if (!saved) {
    await persist()
  }
}

export function readBike(): Bike {
  const [row] = db.exec(
    'SELECT name, brand, model, year, color, engine_type, plate_number, vin, current_odometer FROM bike WHERE id = 1',
  )
  if (!row) {
    return {
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
  }
  const [name, brand, model, year, color, engine_type, plate_number, vin, current_odometer] =
    row.values[0]
  return {
    name: name as string,
    brand: brand as string,
    model: model as string,
    year: year != null ? Number(year) : null,
    color: color as string,
    engine_type: (engine_type as string) as Bike['engine_type'],
    plate_number: plate_number as string,
    vin: vin as string,
    current_odometer: current_odometer != null ? Number(current_odometer) : null,
  }
}

export async function writeBike(bike: Bike): Promise<void> {
  db.run(
    `UPDATE bike SET
      name = :name, brand = :brand, model = :model, year = :year,
      color = :color, engine_type = :engine_type,
      plate_number = :plate_number, vin = :vin,
      current_odometer = :current_odometer
    WHERE id = 1`,
    {
      ':name': bike.name,
      ':brand': bike.brand,
      ':model': bike.model,
      ':year': bike.year,
      ':color': bike.color,
      ':engine_type': bike.engine_type,
      ':plate_number': bike.plate_number,
      ':vin': bike.vin,
      ':current_odometer': bike.current_odometer,
    },
  )
  await persist()
}

export function readLogEntries(): LogEntry[] {
  const [rows] = db.exec(
    'SELECT id, date, odometer, type, title, description, cost, has_attachment FROM log_entry ORDER BY date DESC, id DESC',
  )
  if (!rows) return []
  return rows.values.map(v => ({
    id: v[0] as number,
    date: v[1] as string,
    odometer: v[2] != null ? Number(v[2]) : null,
    type: v[3] as LogEntry['type'],
    title: v[4] as string,
    description: v[5] != null ? (v[5] as string) : null,
    cost: v[6] != null ? Number(v[6]) : null,
    has_attachment: Boolean(v[7]),
  }))
}

export async function insertLogEntry(entry: Omit<LogEntry, 'id'>): Promise<LogEntry> {
  db.run(
    `INSERT INTO log_entry (date, odometer, type, title, description, cost, has_attachment)
     VALUES (:date, :odometer, :type, :title, :description, :cost, :has_attachment)`,
    {
      ':date': entry.date,
      ':odometer': entry.odometer,
      ':type': entry.type,
      ':title': entry.title,
      ':description': entry.description,
      ':cost': entry.cost,
      ':has_attachment': entry.has_attachment ? 1 : 0,
    },
  )
  const [row] = db.exec('SELECT last_insert_rowid()')
  const id = row.values[0][0] as number
  await persist()
  return { ...entry, id }
}
