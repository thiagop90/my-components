import { unblockAvailabilityById } from '@/actions/availability-actions'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { getSlotNameById } from '@/lib/utils'
import type { BlockedAvailability } from '@/types/availability'
import dayjs from 'dayjs'
import { Lock } from 'lucide-react'
import { toast } from 'sonner'

export function AvailabilityBlocker({
  dayData,
}: {
  dayData: BlockedAvailability
}) {
  const slotName = getSlotNameById(dayData.slotId)

  async function handleSubmit() {
    try {
      const result = await unblockAvailabilityById(dayData.id)

      if (result.success) {
        toast.success(result.message)
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="destructive"
          size="icon"
          className="h-7 w-9 rounded-sm bg-red-100 hover:bg-red-100"
        >
          <Lock className="text-destructive/60 size-3" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="bg-secondary w-60 rounded-[18px] border p-1">
        <div className="bg-background rounded-xl border">
          <div className="flex items-center justify-between border-b p-3 text-xs font-semibold">
            <span>{slotName}</span>
            <span>{dayjs(dayData.date).format('DD/MM/YYYY')}</span>
          </div>

          <div className="space-y-1.5 p-3">
            <div className="text-destructive text-xs">
              Esta data está bloqueada.
            </div>
            <div className="text-muted-foreground text-xs">
              Para desbloquear, clique no botão abaixo.
            </div>
          </div>

          <form action={handleSubmit} className="border-t p-3">
            <Button variant="destructive" size="sm" className="w-full">
              Desbloquear
            </Button>
          </form>
        </div>
      </PopoverContent>
    </Popover>
  )
}
