import mysql from "mysql2/promise";
import { getDatabaseConfig } from "./env";

// Database connection configuration
// All credentials must be provided via environment variables
let dbConfig: mysql.PoolOptions | null = null;

function getDbConfig(): mysql.PoolOptions {
  if (!dbConfig) {
    const config = getDatabaseConfig();
    dbConfig = {
      ...config,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0,
      // SSL configuration - try with SSL first, fallback to no SSL if not supported
      // NAVER Cloud DB may or may not require SSL depending on configuration
      ssl: process.env.DB_SSL === 'true' ? {
        rejectUnauthorized: false, // Allow self-signed certificates
      } : undefined,
      // Add connection timeout
      connectTimeout: 10000, // 10 seconds
    };
  }
  return dbConfig;
}

// Create connection pool
let pool: mysql.Pool | null = null;

export function getPool(): mysql.Pool {
  if (!pool) {
    const config = getDbConfig();
    pool = mysql.createPool(config);
  }
  return pool;
}

// Get a single connection (for transactions)
export async function getConnection(): Promise<mysql.PoolConnection> {
  const pool = getPool();
  return await pool.getConnection();
}

// Execute a query
export async function query<T = any>(
  sql: string,
  params?: any[]
): Promise<T[]> {
  try {
    const pool = getPool();
    const [rows] = await pool.execute(sql, params);
    return rows as T[];
  } catch (error) {
    // Log detailed database error
    console.error("Database query error:", {
      sql,
      params: params ? params.map(() => "?") : [],
      error: error instanceof Error ? error.message : error,
      code: (error as any)?.code,
      errno: (error as any)?.errno,
      sqlState: (error as any)?.sqlState,
    });
    throw error;
  }
}

// Execute a query and return first result
export async function queryOne<T = any>(
  sql: string,
  params?: any[]
): Promise<T | null> {
  const results = await query<T>(sql, params);
  return results[0] || null;
}

// Close all connections (useful for cleanup)
export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}
