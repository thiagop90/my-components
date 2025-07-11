import type React from 'react'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { AddSlotForm } from './forms/add-slot-form'
import { cn } from '@/lib/utils'
import { DeleteSlotForm } from './forms/delete-slot-form'
import { UpdateSlotForm } from './forms/update-slot-form'
import { Separator } from '@/components/ui/separator'
import { useSlotContext } from '@/context/slot-context'

interface SlotSelectorProps {
  className?: string
}

export function SlotSelector({ className }: SlotSelectorProps) {
  const { slots, slotId, navigateToSlot } = useSlotContext()

  return (
    <Select value={slotId} onValueChange={navigateToSlot}>
      <SelectTrigger className={cn('w-full focus-visible:ring-0', className)}>
        <SelectValue placeholder="Selecione um slot" />
      </SelectTrigger>
      <SelectContent className="" align="center" sideOffset={2}>
        {slots.length > 0 ? (
          slots.map((slot) => (
            <div key={slot.id} className="group relative">
              <SelectItem value={String(slot.id)}>{slot.name}</SelectItem>

              <div className="bg-background shadow-xsd absolute top-1/2 right-1 flex h-7 -translate-y-1/2 items-center rounded-sm border opacity-0 shadow-xs transition-opacity group-hover:opacity-100">
                <UpdateSlotForm
                  serviceId={slot.service_id}
                  slotId={slot.id}
                  slotName={slot.name}
                />
                <Separator orientation="vertical" />
                <DeleteSlotForm slotId={slot.id} />
              </div>
            </div>
          ))
        ) : (
          <p className="my-4 text-center text-sm">Nenhum slot encontrado.</p>
        )}
        <SelectSeparator />
        <AddSlotForm
          variant="ghost"
          className="justify-start rounded-sm font-normal"
        />
      </SelectContent>
    </Select>
  )
}
