import type React from 'react'
import { DateRangePicker } from '../date-range-picker'
import { Button } from '@/components/ui/button'
import { useState, type ChangeEvent } from 'react'
import { toast } from 'sonner'
import type { DateRange } from '@/hooks/use-date-range'
import type { Slot } from '@/types/slot'
import { useSlotManagement } from '@/hooks/use-slot-management'
import { SlotSelector } from '../slot-selector'
import { QuantityInput } from '../quantity-input'

interface FormState {
  dateRange: DateRange
  quantity: string
}

const initialState: FormState = {
  dateRange: { startDate: null, endDate: null },
  quantity: '',
}

interface BaseAvailabilityFormProps {
  slots: Slot[]
  onClose: () => void
  mode: 'insert' | 'update' | 'block'
  onSubmit: (
    formData: FormData,
  ) => Promise<{ success: boolean; message: string }>
}

const modeConfig = {
  insert: {
    title: 'Inserir',
    buttonText: 'Inserir',
    buttonVariant: 'default' as const,
    description: 'Apenas datas sem disponibilidade serão inseridas',
    showQuantity: true,
  },
  update: {
    title: 'Atualizar',
    buttonText: 'Atualizar',
    buttonVariant: 'default' as const,
    description: 'Apenas datas com disponibilidade serão atualizadas',
    showQuantity: true,
  },
  block: {
    title: 'Bloquear',
    buttonText: 'Bloquear',
    buttonVariant: 'destructive' as const,
    description: 'Apenas datas sem disponibilidade serão bloqueadas',
    showQuantity: false,
  },
}

export function BaseAvailabilityForm({
  slots,
  onClose,
  mode,
  onSubmit,
}: BaseAvailabilityFormProps) {
  const { slotId } = useSlotManagement(slots)
  const [state, setState] = useState<FormState>(initialState)
  const config = modeConfig[mode]

  function updateState(updates: Partial<FormState>) {
    setState((prev) => ({ ...prev, ...updates }))
  }

  function handleQuantityChange(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    const numericValue = value.replace(/\D/g, '')

    if (numericValue.length <= 4) {
      updateState({ quantity: numericValue })
    }
  }

  async function handleFormSubmit(
    formData: FormData,
    submitFunction: (
      formData: FormData,
    ) => Promise<{ success: boolean; message: string }>,
  ) {
    const { dateRange, quantity } = state
    const { startDate, endDate } = dateRange

    if (!startDate || !endDate) {
      toast.error('Por favor, selecione um período válido.')
      return
    }

    formData.append('startDate', startDate.toISOString())
    formData.append('endDate', endDate.toISOString())
    formData.append('slotId', slotId)

    if (config.showQuantity) {
      formData.append('quantity', quantity)
    }

    try {
      const result = await submitFunction(formData)

      if (result.success) {
        updateState(initialState)
        toast.success(result.message)
        onClose()
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      console.error(error)
      toast.error(`Erro inesperado ao ${config.title.toLowerCase()}`)
    }
  }

  const disabledState =
    !state.dateRange.startDate ||
    !state.dateRange.endDate ||
    !slotId ||
    (config.showQuantity && !state.quantity)

  return (
    <form action={(formData) => handleFormSubmit(formData, onSubmit)}>
      <div className="space-y-4 p-3">
        <div className="space-y-2">
          <DateRangePicker
            selected={state.dateRange}
            onSelect={(dateRange) => updateState({ dateRange })}
          />
          <p className="text-muted-foreground text-xs">{config.description}</p>
        </div>

        <SlotSelector slots={slots} />

        {config.showQuantity && (
          <QuantityInput
            value={state.quantity}
            onChange={handleQuantityChange}
          />
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 border-t p-3">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={disabledState}
          variant={config.buttonVariant}
        >
          {config.buttonText}
        </Button>
      </div>
    </form>
  )
}
