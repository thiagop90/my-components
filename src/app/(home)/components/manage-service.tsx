'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Service } from '@/types/database'
import { useRouter, useSearchParams } from 'next/navigation'

interface ManageServiceProps {
  services: Service[]
}

export function ManageService({ services }: ManageServiceProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentServiceId = searchParams.get('serviceId') || ''

  function handleServiceChange(serviceId: string) {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('slotId')
    params.set('serviceId', serviceId)

    router.push(`?${params.toString()}`)
  }

  return (
    <Select value={currentServiceId} onValueChange={handleServiceChange}>
      <SelectTrigger className="bg-muted w-[192px] border-transparent shadow-none">
        <SelectValue placeholder="Selecione um serviço" />
      </SelectTrigger>
      <SelectContent sideOffset={2}>
        {services.map((service) => (
          <SelectItem key={service.id} value={service.id.toString()}>
            {service.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
