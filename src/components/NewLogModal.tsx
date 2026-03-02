import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { useApp } from '@/context/AppContext'
import type { LogType } from '@/types'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const today = () => new Date().toISOString().slice(0, 10)

export default function NewLogModal({ open, onOpenChange }: Props) {
  const { addLogEntry } = useApp()
  const [date, setDate] = useState(today())
  const [odometer, setOdometer] = useState('')
  const [type, setType] = useState<LogType | ''>('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [cost, setCost] = useState('')
  const [hasAttachment, setHasAttachment] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<'date' | 'type' | 'title', string>>>({})

  function reset() {
    setDate(today())
    setOdometer('')
    setType('')
    setTitle('')
    setDescription('')
    setCost('')
    setHasAttachment(false)
    setErrors({})
  }

  function handleOpenChange(value: boolean) {
    if (!value) reset()
    onOpenChange(value)
  }

  async function handleSave() {
    const newErrors: typeof errors = {}
    if (!date) newErrors.date = 'Date is required'
    if (!type) newErrors.type = 'Type is required'
    if (!title.trim()) newErrors.title = 'Title is required'
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    await addLogEntry({
      date,
      odometer: odometer ? Number(odometer) : null,
      type: type as LogType,
      title: title.trim(),
      description: description.trim() || null,
      cost: cost ? Number(cost) : null,
      has_attachment: hasAttachment,
    })
    handleOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>New log entry</DialogTitle>
          <DialogDescription className="sr-only">
            Fill in the details for your new log entry.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="log-date">Date</Label>
            <Input
              id="log-date"
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className={errors.date ? 'border-destructive' : ''}
            />
            {errors.date && <p className="text-xs text-destructive">{errors.date}</p>}
          </div>

          <div className="space-y-1">
            <Label>Type</Label>
            <Select value={type} onValueChange={v => setType(v as LogType)}>
              <SelectTrigger className={errors.type ? 'border-destructive' : ''}>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="modification">Modification</SelectItem>
                <SelectItem value="repair">Repair</SelectItem>
                <SelectItem value="fuel">Fuel</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            {errors.type && <p className="text-xs text-destructive">{errors.type}</p>}
          </div>

          <div className="space-y-1">
            <Label htmlFor="log-title">Title</Label>
            <Input
              id="log-title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Oil change"
              className={errors.title ? 'border-destructive' : ''}
            />
            {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
          </div>

          <div className="space-y-1">
            <Label htmlFor="log-odo">Odometer (km)</Label>
            <Input
              id="log-odo"
              type="number"
              value={odometer}
              onChange={e => setOdometer(e.target.value)}
              placeholder="e.g. 2800"
              min={0}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="log-cost">Cost (฿)</Label>
            <Input
              id="log-cost"
              type="number"
              value={cost}
              onChange={e => setCost(e.target.value)}
              placeholder="e.g. 450"
              min={0}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="log-desc">Notes</Label>
            <Textarea
              id="log-desc"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Optional notes..."
              rows={3}
            />
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="log-attachment"
              checked={hasAttachment}
              onCheckedChange={v => setHasAttachment(v as boolean)}
            />
            <Label htmlFor="log-attachment">Has attachment</Label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
