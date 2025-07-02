import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { createSlot } from '@/actions/slot-actions'
import { toast } from 'sonner'

interface AddSlotFormProps {
  isFirstSlot: boolean
  navigate: (slotName: string) => void
}

export function AddSlotForm({ isFirstSlot, navigate }: AddSlotFormProps) {
  const [isOpen, setIsOpen] = useState(false)

  async function handleSubmit(formData: FormData) {
    try {
      formData.get('slotName')
      formData.append('isFirstSlot', isFirstSlot.toString())

      const result = await createSlot(formData)

      if (result.success && result.slot) {
        setIsOpen(false)
        toast.success(result.message)

        navigate(result.slot.name)
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      console.error('Erro ao criar slot:', error)
    }
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          className={cn(
            isFirstSlot ? 'rounded-r-none border-r' : 'rounded-l-none border-l',
          )}
          size="icon"
          variant="ghost"
        >
          <Plus />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align={isFirstSlot ? 'start' : 'center'}
        sideOffset={6}
        className={cn(
          'bg-secondary w-64 rounded-[18px] p-1',
          !isFirstSlot ? '-ml-3' : '',
        )}
      >
        <form action={handleSubmit} className="bg-background rounded-xl border">
          <div className="space-y-2 p-3">
            <Label htmlFor="slotName">
              {isFirstSlot ? 'Primeiro Slot' : 'Novo Slot'}
            </Label>
            <Input
              id="slotName"
              name="slotName"
              placeholder="Ex: Cadeira 1, Sala A, 20:00..."
              maxLength={50}
            />
            {isFirstSlot && (
              <p className="text-muted-foreground text-xs">
                Este será o primeiro slot da lista
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 border-t p-3">
            <Button
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              variant="outline"
            >
              Cancelar
            </Button>
            <Button size="sm" type="submit">
              Adicionar
            </Button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  )
}
