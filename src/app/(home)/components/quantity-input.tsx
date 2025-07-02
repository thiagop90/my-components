import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { ChangeEvent } from 'react'

interface QuantityInputProps {
  value: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
}

export function QuantityInput({ value, onChange }: QuantityInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="quantity">Quantidade</Label>
      <Input
        id="quantity"
        name="quantity"
        type="text"
        value={value}
        onChange={onChange}
        placeholder="Máx: 9999"
        maxLength={4}
      />
    </div>
  )
}
