'use client'

import { Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { updateAvailabilityById } from '@/actions/availability-actions'

interface AvailabilityEditFormProps {
  availabilityId: string
  currentValue: number
  onCancel: () => void
}

export function AvailabilityEditForm({
  availabilityId,
  currentValue,
  onCancel,
}: AvailabilityEditFormProps) {
  async function handleSubmit(formData: FormData) {
    const newValue = Number(formData.get('available'))
    await updateAvailabilityById(availabilityId, newValue)
  }

  return (
    <form
      action={handleSubmit}
      className="bg-background flex items-center overflow-hidden rounded-md border"
    >
      <input
        type="number"
        name="available"
        className="w-12 pl-2 text-xs font-semibold outline-none disabled:opacity-50"
        defaultValue={currentValue}
        min={0}
        max={999}
        autoFocus
        required
      />
      <Button
        type="submit"
        size="icon"
        variant="ghost"
        className="size-7 rounded-none border-l hover:bg-emerald-50"
      >
        <Check className="size-3.5 text-emerald-400" />
      </Button>
      <Button
        type="button"
        size="icon"
        variant="ghost"
        onClick={onCancel}
        className="size-7 rounded-none border-l hover:bg-red-50"
      >
        <X className="text-destructive size-3.5" />
      </Button>
    </form>
  )
}
