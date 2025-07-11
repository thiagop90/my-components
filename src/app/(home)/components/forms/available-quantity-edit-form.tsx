import { Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { updateAvailabilityById } from '@/actions/availability/update'
import { toast } from 'sonner'
import { useActionState } from 'react'

interface AvailableQuantityEditFormProps {
  availabilityId: number
  currentValue: number
  onCancel: () => void
}

export function AvailableQuantityEditForm({
  availabilityId,
  currentValue,
  onCancel,
}: AvailableQuantityEditFormProps) {
  async function submitForm(initialState: unknown, formData: FormData) {
    const result = await updateAvailabilityById(availabilityId, formData)

    if (result.success) {
      toast.success(result.message)
      onCancel()
    } else {
      toast.error(result.message)
    }

    return result
  }

  const [, formAction, formPending] = useActionState(submitForm, null)

  return (
    <form
      action={formAction}
      className="bg-background flex items-center overflow-hidden rounded-md border"
    >
      <input
        type="number"
        name="available"
        className="w-14 pl-2 text-xs font-semibold outline-none disabled:opacity-50"
        defaultValue={currentValue}
        min={1}
        max={9999}
        autoFocus
      />
      <Button
        type="submit"
        size="icon"
        variant="ghost"
        className="size-7 rounded-none border-l hover:bg-emerald-50"
        disabled={formPending}
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
