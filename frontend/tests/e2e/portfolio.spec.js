import { test, expect } from '@playwright/test';

test('muestra el nombre del perfil', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Rodrigo Zeballos Isita');
});

test('lista los proyectos, incluido Zombie VR', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByTestId('project-card')).toHaveCount(4);
  await expect(page.getByText('Zombie VR')).toBeVisible();
});

test('envía el formulario de contacto', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Nombre').fill('Luis');
  await page.getByLabel('Email').fill('luis@example.com');
  await page.getByLabel('Mensaje').fill('Hola, quiero hablar contigo.');
  await page.getByRole('button', { name: 'Enviar mensaje' }).click();
  await expect(page.getByTestId('contact-status')).toHaveText('Mensaje enviado');
});
