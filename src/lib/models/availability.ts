import type {
  Availability,
  AvailabilityCounts,
  FilterType,
  InsertAvailabilityRequest,
} from '@/types/database'
import { executeQuery, find } from '../db'

export class AvailabilityModel {
  static async findByDates(
    serviceId: number,
    slotId: number,
    dates: string[],
  ): Promise<Array<{ date: string; status: string }>> {
    const placeholders = dates.map(() => '?').join(',')

    return await executeQuery(
      `
      SELECT DATE_FORMAT(date, '%Y-%m-%d') as date, status
      FROM availability 
      WHERE service_id = ? AND slot_id = ? AND date IN (${placeholders})
      `,
      [serviceId, slotId, ...dates],
    )
  }

  static async insertAvailability(
    data: InsertAvailabilityRequest,
  ): Promise<void> {
    await executeQuery(
      'INSERT INTO availability (slot_id, service_id, date, status, total, sold, standby) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [data.slot_id, data.service_id, data.date, 'active', data.total, 0, 0],
    )
  }

  static async findDetailsByDates(
    serviceId: number,
    slotId: number,
    dates: string[],
  ): Promise<
    Array<{
      date: string
      status: string
      total: number
      sold: number
      standby: number
    }>
  > {
    const placeholders = dates.map(() => '?').join(',')

    return await executeQuery(
      `
      SELECT DATE_FORMAT(date, '%Y-%m-%d') as date, status, total, sold, standby
      FROM availability 
      WHERE service_id = ? AND slot_id = ? AND date IN (${placeholders})
      `,
      [serviceId, slotId, ...dates],
    )
  }

  static async updateTotal(
    serviceId: number,
    slotId: number,
    date: string,
    newTotal: number,
  ): Promise<void> {
    await executeQuery(
      'UPDATE availability SET total = ? WHERE service_id = ? AND slot_id = ? AND date = ?',
      [newTotal, serviceId, slotId, date],
    )
  }

  static async createBlock(data: {
    slot_id: number
    service_id: number
    date: string
  }): Promise<void> {
    await executeQuery(
      'INSERT INTO availability (slot_id, service_id, date, status, total, sold, standby) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [data.slot_id, data.service_id, data.date, 'blocked', 0, 0, 0],
    )
  }

  static async updateStatus(
    serviceId: number,
    slotId: number,
    date: string,
  ): Promise<void> {
    await executeQuery(
      'UPDATE availability SET status = ? WHERE service_id = ? AND slot_id = ? AND date = ?',
      ['blocked', serviceId, slotId, date],
    )
  }

  static async findById(id: number): Promise<Availability | null> {
    return await find(`SELECT * FROM availability WHERE id = ?`, [id])
  }

  static async unblockById(id: number): Promise<void> {
    await executeQuery('UPDATE availability SET status = ? WHERE id = ?', [
      'active',
      id,
    ])
  }

  static async deleteById(id: number): Promise<void> {
    await executeQuery('DELETE FROM availability WHERE id = ?', [id])
  }

  static async findByServiceAndSlot(
    serviceId: number,
    slotId: number,
    filter: FilterType,
  ): Promise<Availability[]> {
    let filterCondition = ''
    switch (filter) {
      case 'available':
        filterCondition = 'AND (total - sold - standby) > 0'
        break
      case 'sold':
        filterCondition = 'AND sold > 0'
        break
      case 'standby':
        filterCondition = 'AND standby > 0'
        break
      default:
        filterCondition = ''
    }

    return await executeQuery(
      `SELECT 
        id,
        DATE_FORMAT(date, '%Y-%m-%d') as date,
        status,
        total,
        sold,
        standby,
        slot_id,
        service_id
      FROM availability 
      WHERE service_id = ? AND slot_id = ? ${filterCondition}
      ORDER BY date ASC`,
      [serviceId, slotId],
    )
  }

  static async findCountsByServiceAndSlot(
    serviceId: number,
    slotId: number,
  ): Promise<AvailabilityCounts> {
    const result = await executeQuery(
      `SELECT
        COUNT(*) as allCount,
        SUM(CASE WHEN (total - sold - standby) > 0 THEN 1 ELSE 0 END) as availableCount,
        SUM(CASE WHEN sold > 0 THEN 1 ELSE 0 END) as soldCount,
        SUM(CASE WHEN standby > 0 THEN 1 ELSE 0 END) as standbyCount
      FROM availability
      WHERE service_id = ? AND slot_id = ? AND status = ?`,
      [serviceId, slotId, 'active'],
    )
    return {
      all: result[0]?.allCount || 0,
      available: result[0]?.availableCount || 0,
      sold: result[0]?.soldCount || 0,
      standby: result[0]?.standbyCount || 0,
    }
  }
}
