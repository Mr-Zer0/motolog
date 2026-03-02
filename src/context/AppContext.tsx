import { createContext, useContext, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import type { Bike, LogEntry } from '@/types'

const initialBike: Bike = {
  name: 'Grand Filano',
  brand: 'Yamaha',
  model: 'Grand Filano',
  year: 2025,
  plate_number: '',
  vin: 'ME1SG4310P0123456',
  current_odometer: 2800,
}

const initialLogEntries: LogEntry[] = [
  {
    id: 1,
    date: '2026-02-20',
    type: 'maintenance',
    title: 'Engine oil change',
    odometer: 2800,
    cost: 450,
    has_attachment: false,
    description: 'Changed engine oil to Motul 10W-40 semi-synthetic',
  },
  {
    id: 2,
    date: '2026-01-15',
    type: 'fuel',
    title: 'Fuel refill',
    odometer: 2500,
    cost: 130,
    has_attachment: false,
    description: null,
  },
  {
    id: 3,
    date: '2025-12-01',
    type: 'modification',
    title: 'Phone mount installation',
    odometer: 2000,
    cost: 280,
    has_attachment: true,
    description: 'Installed RAM mount for phone navigation',
  },
  {
    id: 4,
    date: '2025-11-10',
    type: 'repair',
    title: 'Front brake pad replacement',
    odometer: 1800,
    cost: 350,
    has_attachment: false,
    description: null,
  },
]

interface AppContextValue {
  bike: Bike
  setBike: (bike: Bike) => void
  logEntries: LogEntry[]
  addLogEntry: (entry: Omit<LogEntry, 'id'>) => void
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [bike, setBike] = useState<Bike>(initialBike)
  const [logEntries, setLogEntries] = useState<LogEntry[]>(initialLogEntries)
  const nextId = useRef(initialLogEntries.length + 1)

  function addLogEntry(entry: Omit<LogEntry, 'id'>) {
    setLogEntries(prev => [{ ...entry, id: nextId.current++ }, ...prev])
  }

  return (
    <AppContext.Provider value={{ bike, setBike, logEntries, addLogEntry }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
