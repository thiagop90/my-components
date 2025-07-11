import { AlertCircle, Loader2, Trash2 } from 'lucide-react'
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
import { deleteSlot } from '@/actions/slots'
import { toast } from 'sonner'
import { useRouter, useSearchParams } from 'next/navigation'

interface SlotFormProps {
  className?: string
  slotId: number
}

export function DeleteSlotForm({ className, slotId }: SlotFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const searchParams = useSearchParams()
  const router = useRouter()

  async function submitForm() {
    const result = await deleteSlot(slotId)

    if (result.success) {
      const params = new URLSearchParams(searchParams.toString())
      params.delete('slotId')
      router.replace('?' + params.toString())

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
            'text-destructive hover:text-destructive size-7 rounded-l-none rounded-r-sm shadow-none focus-visible:z-10',
            className,
          )}
        >
          <Trash2 className="size-3" />
        </Button>
      </DialogTrigger>
      <DialogContent
        showCloseButton={false}
        className="bg-secondary w-fit rounded-[18px] p-1.5"
      >
        <form action={formAction}>
          <div className="bg-background rounded-xl border">
            <DialogHeader className="flex-row items-center justify-between border-b p-3">
              <DialogTitle className="text-base">
                Confirmar exclusão
              </DialogTitle>
            </DialogHeader>

            <div className="p-3">
              <div className="border-destructive bg-destructive/10 rounded-sm border p-4">
                <div className="flex items-start gap-4">
                  <AlertCircle className="text-destructive size-5" />
                  <div className="space-y-1.5 text-xs">
                    <p className="font-medium">
                      Esta ação não pode ser desfeita.
                    </p>
                    <span className="text-destructive">
                      Tem certeza de que deseja excluir o slot?
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="grid grid-cols-2 gap-2 border-t p-3">
              <DialogClose asChild>
                <Button variant="outline">Cancelar</Button>
              </DialogClose>

              <Button
                variant="destructive"
                type="submit"
                disabled={formPending}
              >
                {formPending && <Loader2 className="animate-spin" />}
                Confirmar
              </Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
