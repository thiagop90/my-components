import { Loader2, Pencil } from 'lucide-react'
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
import { cn } from '@/lib/utils'
import { useActionState, useState } from 'react'
import { updateSlot } from '@/actions/slots'
import { toast } from 'sonner'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

interface SlotFormProps {
  className?: string
  slotId: number
  serviceId: number
  slotName: string
}

export function UpdateSlotForm({
  className,
  slotId,
  serviceId,
  slotName,
}: SlotFormProps) {
  const [isOpen, setIsOpen] = useState(false)

  async function submitForm(initialState: unknown, formData: FormData) {
    const result = await updateSlot(slotId, serviceId, formData)

    if (result.success) {
      toast.success(result.message)
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
          size="icon"
          variant="ghost"
          className={cn(
            'size-7 rounded-l-sm rounded-r-none shadow-none focus-visible:z-10',
            className,
          )}
        >
          <Pencil className="size-3" />
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
                Atualizar nome do slot
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-2 px-3 py-4">
              <Label htmlFor="name">Novo nome</Label>
              <Input
                id="name"
                name="name"
                defaultValue={slotName}
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
                Atualizar
              </Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
