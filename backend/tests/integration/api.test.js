import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../app.js';

describe('API del portafolio', () => {
  it('GET /api/profile devuelve el perfil', async () => {
    const response = await request(app).get('/api/profile');
    expect(response.status).toBe(200);
    expect(response.body.name).toBe('Rodrigo Zeballos Isita');
  });

  it('GET /api/projects devuelve los proyectos', async () => {
    const response = await request(app).get('/api/projects');
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(4);
    expect(response.body.some((project) => project.title === 'Zombie VR')).toBe(true);
  });

  it('POST /api/contact valida el mensaje', async () => {
    const valid = await request(app).post('/api/contact').send({
      name: 'Luis',
      email: 'luis@example.com',
      message: 'Hola, quiero hablar contigo.'
    });
    expect(valid.status).toBe(201);

    const invalid = await request(app).post('/api/contact').send({ name: 'x' });
    expect(invalid.status).toBe(400);
    expect(invalid.body.errors.length).toBeGreaterThan(0);
  });
});
