import { Pool, QueryResult } from "pg";

const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  database: process.env.DB_NAME || "notes_hub",
});

pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
});

export const query = (text: string, params?: any[]): Promise<QueryResult> => {
  return pool.query(text, params);
};

export const getClient = async () => {
  return pool.connect();
};

export const initializeDatabase = async () => {
  try {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS notes (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_notes_created_at ON notes(created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_notes_updated_at ON notes(updated_at DESC);
    `;

    await query(createTableQuery);
    console.log("Database tables initialized successfully");
  } catch (error) {
    console.error("Failed to initialize database:", error);
    throw error;
  }
};

export default pool;
