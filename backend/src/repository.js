import { profile, projects as seedProjects } from './data.js';
import { pool, initDb, isDbAvailable } from './db.js';

const memory = {
  projects: [...seedProjects],
  messages: []
};

export const ready = initDb();

export function getProfile() {
  return profile;
}

export async function getProjects() {
  await ready;
  if (!pool || !isDbAvailable()) return memory.projects;
  const { rows } = await pool.query('SELECT id, title, description, url FROM projects ORDER BY id');
  return rows;
}

export async function saveContact(data) {
  await ready;
  if (!pool || !isDbAvailable()) {
    memory.messages.push(data);
    return;
  }
  await pool.query(
    'INSERT INTO contact_messages (name, email, message) VALUES ($1, $2, $3)',
    [data.name, data.email, data.message]
  );
}
