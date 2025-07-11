import { Loader2, PlusIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { useActionState, useState } from 'react'
import { createSlot } from '@/actions/slots'
import { toast } from 'sonner'
import { useSlotContext } from '@/context/slot-context'

interface AddSlotFormProps {
  size?: 'default' | 'icon'
  variant?: 'ghost' | 'secondary'
  className?: string
  serviceId: number
}

export function AddSlotForm({
  size = 'default',
  variant = 'secondary',
  serviceId,
  className,
}: AddSlotFormProps) {
  const { navigateToSlot } = useSlotContext()
  const [isOpen, setIsOpen] = useState(false)

  async function submitForm(initialState: unknown, formData: FormData) {
    const result = await createSlot(serviceId, formData)

    if (result.success && result.slotId) {
      toast.success(result.message)
      navigateToSlot(result.slotId)
      setIsOpen(false)
    } else {
      toast.error(result.message)
    }

    return result
  }

  const [, formAction, formPending] = useActionState(submitForm, null)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          size={size}
          variant={variant}
          className={cn(
            'shadow-none focus-visible:z-10',
            size === 'default' && 'w-full',
            className,
          )}
        >
          <PlusIcon />
          {size === 'default' && 'Adicionar slot'}
        </Button>
      </DialogTrigger>
      <DialogContent
        showCloseButton={false}
        className="bg-secondary max-w-xs rounded-[18px] p-1.5"
      >
        <form action={formAction}>
          <div className="bg-background rounded-xl border">
            <DialogHeader className="flex-row items-center justify-between border-b p-3">
              <DialogTitle className="text-base">
                Adicionar novo slot
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-2 px-3 py-4">
              <Label htmlFor="name">Nome do slot</Label>
              <Input
                id="name"
                name="name"
                placeholder="Ex: Cadeira 1, Sala A..."
                maxLength={50}
                onKeyDown={(e) => e.stopPropagation()}
              />
            </div>

            <DialogFooter className="grid grid-cols-2 gap-2 border-t p-3">
              <DialogClose asChild>
                <Button variant="outline">Cancelar</Button>
              </DialogClose>

              <Button type="submit" disabled={formPending}>
                {formPending && <Loader2 className="animate-spin" />}
                Adicionar
              </Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
