import "dotenv/config";
import pg from "pg";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set to connect to PostgreSQL");
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

pool.on("error", (error) => {
  console.error("Unexpected PostgreSQL pool error:", error);
});

export const query = (text, params) => pool.query(text, params);

export const initializeDatabase = async () => {
  await query(`
    CREATE TABLE IF NOT EXISTS users (
      id BIGSERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      lastname TEXT NOT NULL,
      mail TEXT NOT NULL UNIQUE,
      pass TEXT NOT NULL,
      confirmed BOOLEAN NOT NULL DEFAULT FALSE,
      bio TEXT NOT NULL DEFAULT '',
      image TEXT
    )
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS photos (
      id BIGSERIAL PRIMARY KEY,
      album TEXT NOT NULL,
      original_name TEXT NOT NULL,
      owner TEXT NOT NULL DEFAULT '',
      url TEXT NOT NULL,
      last_change TEXT NOT NULL DEFAULT 'original',
      history JSONB NOT NULL DEFAULT '[]'::jsonb,
      tags JSONB NOT NULL DEFAULT '[]'::jsonb,
      description TEXT
    )
  `);
};
