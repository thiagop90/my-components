/* eslint-disable @typescript-eslint/no-explicit-any */
import mysql from 'mysql2/promise'

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
})

export async function executeQuery<T = any>(
  query: string,
  values?: any[],
): Promise<T[]> {
  try {
    const [rows] = await pool.execute(query, values)
    return rows as T[]
  } catch (error) {
    console.error('Erro na query:', error)
    throw error
  }
}

export async function insertAndGetId(
  query: string,
  values?: any[],
): Promise<number> {
  try {
    const [result] = await pool.execute(query, values)
    return (result as any).insertId
  } catch (error) {
    console.error('Erro no insert:', error)
    throw error
  }
}

export async function find<T = any>(
  query: string,
  values?: any[],
): Promise<T | null> {
  try {
    const [rows] = await pool.execute(query, values)
    const results = rows as T[]

    return results[0] || null
  } catch (error) {
    console.error('Erro na query:', error)
    throw error
  }
}

export async function testConnection(): Promise<boolean> {
  try {
    const connection = await pool.getConnection()
    await connection.ping()
    connection.release()
    console.log('✅ Conectado ao MySQL Cloud SQL')
    return true
  } catch (error) {
    console.error('❌ Erro ao conectar:', error)
    return false
  }
}
