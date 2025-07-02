'use client'

import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { Slot } from '@/types/slot'

import { useState } from 'react'
import { BaseAvailabilityForm } from './forms/base-availability-form'
import {
  blockAvailability,
  insertAvailability,
  updateAvailability,
} from '@/actions/availability-actions'

export function ManageAvailabilityTable({ slots }: { slots: Slot[] }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button className="ml-auto">Gerenciar</Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={6}
        className="bg-secondary rounded-[18px] p-1"
      >
        <div className="bg-background rounded-xl border">
          <Tabs defaultValue="insert">
            <TabsList className="text-foreground h-auto w-full gap-2 rounded-none border-b bg-transparent px-3 pt-3 pb-1">
              <TabsTrigger value="insert">Inserir</TabsTrigger>
              <TabsTrigger value="update">Atualizar</TabsTrigger>
              <TabsTrigger value="block">Bloquear</TabsTrigger>
            </TabsList>
            <TabsContent value="insert">
              <BaseAvailabilityForm
                slots={slots}
                onClose={() => setIsOpen(false)}
                mode="insert"
                onSubmit={insertAvailability}
              />
            </TabsContent>
            <TabsContent value="update">
              <BaseAvailabilityForm
                slots={slots}
                onClose={() => setIsOpen(false)}
                mode="update"
                onSubmit={updateAvailability}
              />
            </TabsContent>
            <TabsContent value="block">
              <BaseAvailabilityForm
                slots={slots}
                onClose={() => setIsOpen(false)}
                mode="block"
                onSubmit={blockAvailability}
              />
            </TabsContent>
          </Tabs>
        </div>
      </PopoverContent>
    </Popover>
  )
}
