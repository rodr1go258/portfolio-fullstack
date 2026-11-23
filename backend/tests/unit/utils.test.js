import { describe, it, expect } from 'vitest';
import { sanitizeText, validateContact, projectSummary } from '../../src/utils.js';

describe('utilidades del portafolio', () => {
  it('sanitizeText elimina etiquetas y espacios', () => {
    expect(sanitizeText('  <hola>  ')).toBe('hola');
  });

  it('validateContact rechaza datos inválidos y acepta datos válidos', () => {
    const bad = validateContact({ name: 'A', email: 'no-email', message: 'corto' });
    expect(bad.valid).toBe(false);
    expect(bad.errors).toHaveLength(3);

    const good = validateContact({
      name: 'Ana',
      email: 'ana@example.com',
      message: 'Hola, me gustaría contactarte.'
    });
    expect(good.valid).toBe(true);
    expect(good.data.email).toBe('ana@example.com');
  });

  it('projectSummary limita la descripción a 40 caracteres', () => {
    const summary = projectSummary({
      id: 1,
      title: 'Proyecto',
      description: 'x'.repeat(80)
    });
    expect(summary.description).toHaveLength(40);
    expect(summary.title).toBe('Proyecto');
  });
});
