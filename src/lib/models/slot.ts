import type { Slot } from '@/types/database'
import { executeQuery, find, insertAndGetId } from '../db'

export class SlotModel {
  static async getByServiceId(serviceId: number): Promise<Slot[]> {
    return executeQuery<Slot>(
      'SELECT * FROM slots WHERE service_id = ? ORDER BY created_at ASC',
      [serviceId],
    )
  }

  static async getByName(
    name: string,
    serviceId: number,
  ): Promise<Slot | null> {
    return find<Slot>('SELECT * FROM slots WHERE service_id = ? AND name = ?', [
      serviceId,
      name,
    ])
  }

  static async create(name: string, serviceId: number): Promise<number> {
    return insertAndGetId(
      'INSERT INTO slots (name, service_id) VALUES (?, ?)',
      [name, serviceId],
    )
  }

  static async updateName(name: string, slotId: number): Promise<void> {
    await executeQuery('UPDATE slots SET name = ? WHERE id = ?', [name, slotId])
  }

  static async delete(slotId: number): Promise<void> {
    await executeQuery('DELETE FROM slots WHERE id = ?', [slotId])
  }
}
