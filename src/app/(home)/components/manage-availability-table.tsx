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
import { ChevronDownIcon } from 'lucide-react'

export function ManageAvailabilityTable({ slots }: { slots: Slot[] }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="divide-primary-foreground/30 ml-auto inline-flex divide-x rounded-md shadow-xs rtl:space-x-reverse">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button className="rounded-none shadow-none first:rounded-s-md last:rounded-e-md focus-visible:z-10">
            Adicionar
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="end"
          alignOffset={-36}
          sideOffset={6}
          className="bg-secondary rounded-[18px] p-1"
        >
          <div className="bg-background rounded-xl border">
            <BaseAvailabilityForm
              slots={slots}
              onClose={() => setIsOpen(false)}
              mode="insert"
              onSubmit={insertAvailability}
            />
          </div>
        </PopoverContent>
      </Popover>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            className="rounded-none shadow-none first:rounded-s-md last:rounded-e-md focus-visible:z-10"
            size="icon"
            aria-label="Options"
          >
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          sideOffset={6}
          align="end"
          className="bg-secondary rounded-[18px] p-1"
        >
          <div className="bg-background rounded-xl border">
            <Tabs defaultValue="insert">
              <TabsList className="text-foreground h-auto w-full gap-2 rounded-none border-b bg-transparent px-3 pt-3 pb-1">
                <TabsTrigger value="update">Atualizar</TabsTrigger>
                <TabsTrigger value="block">Bloquear</TabsTrigger>
              </TabsList>
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
    </div>
  )
}
