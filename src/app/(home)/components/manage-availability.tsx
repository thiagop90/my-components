'use client'

import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { useState } from 'react'
import { AvailabilityForm } from './forms/availability-form'
import { ChevronDownIcon } from 'lucide-react'
import { insertAvailability } from '@/actions/availability/insert'
import { updateAvailabilityTotal } from '@/actions/availability/update'
import { blockAvailability } from '@/actions/availability/blocked'

export function ManageAvailability({ serviceId }: { serviceId: number }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isOptionsOpen, setIsOptionsOpen] = useState(false)

  return (
    <div className="divide-primary-foreground/30 inline-flex divide-x rounded-md shadow-xs rtl:space-x-reverse">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button className="rounded-none shadow-none first:rounded-s-md last:rounded-e-md focus-visible:z-10">
            Inserir
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="end"
          alignOffset={-36}
          sideOffset={6}
          className="bg-secondary rounded-[18px] p-1"
        >
          <div className="bg-background rounded-xl border">
            <AvailabilityForm
              mode="insert"
              serviceId={serviceId}
              onClose={() => setIsOpen(false)}
              onSubmit={insertAvailability}
            />
          </div>
        </PopoverContent>
      </Popover>
      <Popover open={isOptionsOpen} onOpenChange={setIsOptionsOpen}>
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
                <AvailabilityForm
                  mode="update"
                  serviceId={serviceId}
                  onClose={() => setIsOptionsOpen(false)}
                  onSubmit={updateAvailabilityTotal}
                />
              </TabsContent>
              <TabsContent value="block">
                <AvailabilityForm
                  mode="block"
                  serviceId={serviceId}
                  onClose={() => setIsOptionsOpen(false)}
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
