import type { Service } from '@/types/database'
import { executeQuery, find } from '../db'

export class ServiceModel {
  static async getAll(): Promise<Service[]> {
    return executeQuery<Service>('SELECT * FROM services ORDER BY id DESC')
  }

  static async getByName(name: string): Promise<Service | null> {
    return find<Service>('SELECT * FROM services WHERE name = ?', [name])
  }

  static async create(name: string): Promise<void> {
    await executeQuery('INSERT INTO services (name) VALUES (?)', [name])
  }

  static async delete(id: number): Promise<void> {
    await executeQuery('DELETE FROM services WHERE id = ?', [id])
  }
}
