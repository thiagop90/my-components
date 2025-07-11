import type React from 'react'
import { DateRangePicker } from '../date-range-picker'
import { Button } from '@/components/ui/button'
import { useActionState, useState } from 'react'
import type { DateRange } from '@/hooks/use-date-range'
import { WeekdayExcluder } from '../weekday-excluder'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

import { SlotSelector } from '../slot-selector'
import { Loader2 } from 'lucide-react'
import { EMPTY_FORM_STATE, type ActionState } from '@/lib/form-state'
import { useSlotContext } from '@/context/slot-context'

interface AvailabilityFormProps {
  mode: 'insert' | 'update' | 'block'
  onClose: () => void
  onSubmit: (
    serviceId: number,
    _actionState: ActionState,
    formData: FormData,
  ) => Promise<ActionState>
  serviceId: number
}

export function AvailabilityForm({
  onClose,
  onSubmit,
  mode,
  serviceId,
}: AvailabilityFormProps) {
  const { slotId } = useSlotContext()

  const [date, setDate] = useState<DateRange>({
    startDate: null,
    endDate: null,
  })

  async function submitForm(initialState: ActionState, formData: FormData) {
    formData.set('slotId', slotId)
    formData.set('startDate', date.startDate?.toISOString() ?? '')
    formData.set('endDate', date.endDate?.toISOString() ?? '')

    const result = await onSubmit(serviceId, EMPTY_FORM_STATE, formData)

    if (result.success) {
      toast.success(result.message)
      onClose()
    } else {
      toast.error(result.message)
    }

    return result
  }

  const [formState, formAction, formPending] = useActionState(
    submitForm,
    EMPTY_FORM_STATE,
  )

  return (
    <form action={formAction}>
      <div className="space-y-4 p-3">
        <div className="space-y-2">
          <Label>Slot</Label>
          <SlotSelector serviceId={serviceId} className="w-full" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="period">Período</Label>
          <DateRangePicker selected={date} onSelect={setDate} />
        </div>

        <div className="space-y-2">
          <Label className="text-foreground text-sm font-medium">
            Ignorar dias da semana
          </Label>
          <WeekdayExcluder />
        </div>

        {mode !== 'block' && (
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantidade</Label>
            <Input
              id="quantity"
              type="number"
              name="quantity"
              defaultValue={formState.payload?.get('quantity') as string}
              min={1}
              max={9999}
              placeholder="Máx: 9999"
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 border-t p-3">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>

        <Button type="submit" disabled={formPending}>
          {formPending && <Loader2 className="animate-spin" />}
          {mode === 'insert' && 'Inserir'}
          {mode === 'update' && 'Atualizar'}
          {mode === 'block' && 'Bloquear'}
        </Button>
      </div>
    </form>
  )
}
