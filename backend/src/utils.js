export function sanitizeText(value) {
  return String(value ?? '').trim().replace(/[<>]/g, '');
}

export function validateContact({ name, email, message } = {}) {
  const errors = [];
  const data = {
    name: sanitizeText(name),
    email: sanitizeText(email).toLowerCase(),
    message: sanitizeText(message)
  };

  if (data.name.length < 2) errors.push('El nombre debe tener al menos 2 caracteres');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.push('El email no es válido');
  if (data.message.length < 10) errors.push('El mensaje debe tener al menos 10 caracteres');

  return { valid: errors.length === 0, errors, data };
}

export function projectSummary(project) {
  return {
    id: project.id,
    title: project.title,
    description: String(project.description ?? '').slice(0, 40)
  };
}
