import { AvailabilityFilters } from './components/availability-filters'
import { AvailabilityTable } from './components/availability-table'

import { getSlotsByService } from '@/actions/slots'

import { ManageAvailability } from './components/manage-availability'
import { ManageService } from './components/manage-service'
import { getServices } from '@/actions/services'
import { getAvailability } from '@/actions/availability/select'
import { SlotProvider } from '@/context/slot-context'

export default async function Home(props: {
  searchParams: Promise<{
    serviceId?: string
    slotId?: string
  }>
}) {
  const searchParams = await props.searchParams
  const serviceId = Number(searchParams.serviceId) || null
  const slotId = Number(searchParams.slotId) || null

  const services = await getServices()
  const slots = serviceId ? await getSlotsByService(serviceId) : []

  const availabilityResult =
    serviceId && slotId
      ? await getAvailability(serviceId, slotId)
      : { data: [], counts: { all: 0, available: 0, sold: 0, standby: 0 } }

  return (
    <main className="mx-auto min-h-dvh max-w-5xl space-y-6 overflow-hidden border-x px-4 py-10 sm:px-6">
      <SlotProvider slots={slots}>
        <div className="flex flex-col-reverse gap-4 border-b sm:flex-row sm:items-start">
          <AvailabilityFilters counts={availabilityResult.counts} />

          <div className="ml-auto flex gap-2">
            <ManageService services={services} />
            {serviceId && <ManageAvailability serviceId={serviceId} />}
          </div>
        </div>

        <div className="bg-secondary rounded-[20px] border p-1.5">
          <AvailabilityTable
            serviceId={serviceId}
            data={availabilityResult.data}
          />
        </div>
      </SlotProvider>
    </main>
  )
}
