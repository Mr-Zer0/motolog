export type LogType = 'maintenance' | 'modification' | 'repair' | 'fuel' | 'other'

export interface Bike {
  name: string
  brand: string
  model: string
  year: number | null
  plate_number: string
  vin: string
  current_odometer: number | null
}

export interface LogEntry {
  id: number
  date: string
  odometer: number | null
  type: LogType
  title: string
  description: string | null
  cost: number | null
  has_attachment: boolean
}
