import pg from 'pg';
import { projects } from './data.js';

export const pool = process.env.DATABASE_URL
  ? new pg.Pool({ connectionString: process.env.DATABASE_URL })
  : null;

let dbAvailable = false;

export function isDbAvailable() {
  return dbAvailable;
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function initDb() {
  if (!pool) return;

  try {
    let connected = false;
    for (let attempt = 1; attempt <= 15; attempt += 1) {
      try {
        await pool.query('SELECT 1');
        connected = true;
        break;
      } catch {
        await delay(1000);
      }
    }

    if (!connected) {
      console.warn('PostgreSQL no disponible; el backend usa datos en memoria.');
      return;
    }

    await pool.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        url TEXT NOT NULL
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);

    const { rowCount } = await pool.query('SELECT id FROM projects');
    if (rowCount === 0) {
      for (const project of projects) {
        await pool.query(
          'INSERT INTO projects (id, title, description, url) VALUES ($1, $2, $3, $4)',
          [project.id, project.title, project.description, project.url]
        );
      }
    }

    dbAvailable = true;
  } catch (error) {
    console.warn(`PostgreSQL no disponible (${error.message}); el backend usa datos en memoria.`);
  }
}
