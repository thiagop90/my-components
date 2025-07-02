'use client'

import type React from 'react'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useSlotManagement } from '@/hooks/use-slot-management'
import type { Slot } from '@/types/slot'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Check, X, Plus } from 'lucide-react'
import { createSlot } from '@/actions/slot-actions'
import { toast } from 'sonner'
import { Label } from '@/components/ui/label'

interface SlotSelectorProps {
  slots: Slot[]
}

export function SlotSelector({ slots }: SlotSelectorProps) {
  const { slotId, navigateToSlot } = useSlotManagement(slots)
  const [isCreating, setIsCreating] = useState(false)

  const [newSlotName, setNewSlotName] = useState('')

  function handleSlotChange(value: string) {
    if (value === 'CREATE_NEW') {
      setIsCreating(true)
      setNewSlotName('')
      return
    }

    const selectedSlot = slots.find((slot) => slot.id === value)
    if (selectedSlot) {
      navigateToSlot(selectedSlot.name)
    }
  }

  async function handleCreateSlot() {
    try {
      const formData = new FormData()
      formData.append('slotName', newSlotName)

      const result = await createSlot(formData)

      if (result.success && result.slot) {
        toast.success(result.message)
        setIsCreating(false)

        navigateToSlot(result.slot.name)
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      console.error(error)
    }
  }

  if (isCreating) {
    return (
      <div className="space-y-2">
        <Label htmlFor="slotName">Novo slot</Label>
        <div className="flex">
          <Input
            id="slotName"
            name="slotName"
            value={newSlotName}
            onChange={(e) => setNewSlotName(e.target.value)}
            placeholder="Ex: Cadeira 1, Sala A..."
            className="-mr-px rounded-r-none focus-visible:z-10"
            autoFocus
          />
          <Button
            type="button"
            size="icon"
            variant="outline"
            className="-mr-px rounded-none focus-visible:z-10"
            onClick={handleCreateSlot}
          >
            <Check className="text-emerald-600" />
          </Button>
          <Button
            type="button"
            size="icon"
            variant="outline"
            className="rounded-l-none focus-visible:z-10"
            onClick={() => setIsCreating(false)}
          >
            <X className="text-destructive" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-2">
      <Label htmlFor="slot">Slot</Label>
      <Select value={slotId} onValueChange={handleSlotChange}>
        <SelectTrigger id="slot" className="w-full">
          <SelectValue placeholder="Slot" />
        </SelectTrigger>
        <SelectContent sideOffset={2}>
          {slots.map((slot) => (
            <SelectItem key={slot.id} value={slot.id}>
              {slot.name}
            </SelectItem>
          ))}
          <SelectItem value="CREATE_NEW">
            <div className="flex items-center gap-2">
              <Plus className="size-4 opacity-60" />
              <span>Novo slot</span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
