import express from 'express';
import cors from 'cors';
import { validateContact } from './src/utils.js';
import { getProfile, getProjects, saveContact } from './src/repository.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/profile', (_req, res) => {
  res.json(getProfile());
});

app.get('/api/projects', async (_req, res) => {
  res.json(await getProjects());
});

app.post('/api/contact', async (req, res) => {
  const result = validateContact(req.body || {});
  if (!result.valid) {
    return res.status(400).json({ errors: result.errors });
  }
  await saveContact(result.data);
  res.status(201).json({ ok: true, message: 'Mensaje recibido' });
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

export default app;
