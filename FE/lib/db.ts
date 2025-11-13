import mysql from "mysql2/promise";

// Database connection configuration
// Use environment variables for security
const dbConfig: mysql.PoolOptions = {
  host: process.env.DB_HOST || "db-3c34ls-kr.vpc-pub-cdb.ntruss.com",
  user: process.env.DB_USER || "dbadmin",
  password: process.env.DB_PASSWORD || "Hackathon@2025",
  database: process.env.DB_NAME || "hackathondb",
  port: parseInt(process.env.DB_PORT || "3306"),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
};

// Create connection pool
let pool: mysql.Pool | null = null;

export function getPool(): mysql.Pool {
  if (!pool) {
    pool = mysql.createPool(dbConfig);
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
  const pool = getPool();
  const [rows] = await pool.execute(sql, params);
  return rows as T[];
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

