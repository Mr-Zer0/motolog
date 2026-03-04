import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { Bike, LogEntry } from '@/types'
import {
  initDatabase,
  readBike,
  writeBike,
  readLogEntries,
  insertLogEntry,
} from '@/db/database'

interface AppContextValue {
  isReady: boolean
  bike: Bike | null
  saveBike: (bike: Bike) => Promise<void>
  logEntries: LogEntry[]
  addLogEntry: (entry: Omit<LogEntry, 'id'>) => Promise<void>
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [isReady, setIsReady] = useState(false)
  const [bike, setBikeState] = useState<Bike | null>(null)
  const [logEntries, setLogEntries] = useState<LogEntry[]>([])

  useEffect(() => {
    async function init() {
      await initDatabase()
      const [bike, entries] = await Promise.all([readBike(), readLogEntries()])
      setBikeState(bike)
      setLogEntries(entries)
      setIsReady(true)
    }
    init().catch(console.error)
  }, [])

  async function saveBike(bike: Bike) {
    await writeBike(bike)
    setBikeState(bike)
  }

  async function addLogEntry(entry: Omit<LogEntry, 'id'>) {
    const inserted = await insertLogEntry(entry)
    setLogEntries(prev => [inserted, ...prev])
  }

  return (
    <AppContext.Provider value={{ isReady, bike, saveBike, logEntries, addLogEntry }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
