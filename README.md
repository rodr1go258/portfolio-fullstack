# Portafolio fullstack — Rodrigo Zeballos Isita

Portafolio personal con **React + Vite** (frontend), **Express + Node.js** (backend) y **PostgreSQL** (base de datos), con un pipeline de **GitHub Actions** que cumple la consigna:

- Push a `dev` → pruebas automáticas.
- Push a `main` → empaquetado Docker, Docker Hub, Terraform y Ansible.
- Mínimo 3 tests unitarios, 3 de integración y 3 E2E.

Repositorio: https://github.com/rodr1go258/portfolio-fullstack

> Tu usuario de GitHub es `rodr1go258` (con "o"); tu usuario de Docker Hub es `rodr1g0258` (con cero).

## Estructura del proyecto

```
.github/workflows/pipeline.yml   Pipeline de GitHub Actions (dev y main)
docker-compose.yml               Frontend + backend + PostgreSQL
backend/
  Dockerfile
  app.js, server.js              API REST y arranque del servidor
  src/                           Datos, conexión a BD y repositorio
  tests/unit/                    3 tests unitarios (Vitest)
  tests/integration/             3 tests de integración (Supertest)
frontend/
  Dockerfile, nginx.conf         Build multi-stage y proxy /api
  src/                           Interfaz React
  public/perfil.png              Foto personal
  tests/e2e/                     3 tests E2E (Playwright)
terraform/
  main.tf, variables.tf, outputs.tf   VPC, subnets, IP pública y VM Ubuntu 24.04
ansible/
  playbook.yml                   Docker, Git, ufw e iptables 80/443
```

## 1. Ejecutar en local (sin Docker)

Requisitos: Node.js 20 y npm.

```powershell
# Terminal 1: backend
cd backend
npm ci
npm start
# API: http://127.0.0.1:3001/api/profile
```

```powershell
# Terminal 2: frontend
cd frontend
npm ci
npm run dev
# Web: http://127.0.0.1:5173
```

Sin `DATABASE_URL`, el backend usa los datos en memoria, así que el portafolio funciona igual.

## 2. Ejecutar los tests

```powershell
cd backend
npm run test:unit        # 3 passed
npm run test:integration # 3 passed

cd ../frontend
npm run test:e2e         # 3 passed
```

Total: **9 tests** (3 unitarios + 3 de integración + 3 E2E).

## 3. Ejecutar con Docker

```powershell
docker build -t rodr1g0258/portfolio-backend:latest ./backend
docker build -t rodr1g0258/portfolio-frontend:latest ./frontend
docker compose up -d
docker compose ps
```

El resultado esperado es:

```
portfolio-db       Up (healthy)
portfolio-backend  Up
portfolio-frontend Up  0.0.0.0:8080->80/tcp
```

URLs:

- Portafolio: http://127.0.0.1:8080
- API: http://127.0.0.1:8080/api/profile
- Proyectos: http://127.0.0.1:8080/api/projects

> El compose publica `80:80` para la VM y también `8080:80` porque en Windows puede haber otro servicio (por ejemplo Apache) ocupando el puerto 80. Si el backend se reinicia, revisá con `docker compose logs backend`: el compose ya espera a que PostgreSQL esté `healthy` antes de arrancarlo.

Para comprobar que la BD guarda datos:

```powershell
docker compose exec -T db psql -U portfolio -d portfolio -c "SELECT * FROM projects;"
docker compose exec -T db psql -U portfolio -d portfolio -c "SELECT * FROM contact_messages;"
```

## 4. GitHub Actions

El pipeline está en `.github/workflows/pipeline.yml`:

| Rama | Job | Qué hace |
|---|---|---|
| `dev` | `pruebas` | Instala dependencias, corre los 9 tests e instala Chromium para Playwright |
| `main` | `despliegue` | Construye y sube imágenes a Docker Hub, aplica Terraform y configura la VM con Ansible |

Si un push a `dev` o `main` falla, revisá el detalle en:
https://github.com/rodr1go258/portfolio-fullstack/actions

### Secrets necesarios para la parte cloud

En GitHub → *Settings → Secrets and variables → Actions → New repository secret*:

| Secret | Uso |
|---|---|
| `DOCKERHUB_TOKEN` | Subir las imágenes a Docker Hub (`rodr1g0258`) |
| `AWS_ACCESS_KEY_ID` | Crear la VPC, subnets y VM con Terraform |
| `AWS_SECRET_ACCESS_KEY` | Credencial AWS |
| `AWS_REGION` | Región de la VM (por ejemplo `us-east-1`) |
| `SSH_PUBLIC_KEY` | Llave pública para la instancia |
| `SSH_PRIVATE_KEY` | Llave privada usada por Ansible |
| `CLOUDFLARE_API_TOKEN` | URL pública opcional en Cloudflare Pages |
| `CLOUDFLARE_ACCOUNT_ID` | Account ID de Cloudflare |
| `DOMAIN_NAME` | Dominio opcional para el registro DNS |

Sin estos secrets los pasos cloud se marcan como `skipped` y el pipeline igual termina en verde. Al cargarlos, los mismos pasos se ejecutan automáticamente.

## 5. Terraform y Ansible

Terraform crea una VPC, dos subnets públicas, Internet Gateway, tabla de rutas, security group con los puertos 22/80/443, key pair y una instancia Ubuntu 24.04 Noble con IP pública.

```powershell
cd terraform
terraform init
terraform apply -auto-approve
terraform output -raw public_ip
```

Ansible instala Docker y Git, habilita ufw e iptables en los puertos 80 y 443, copia el `docker-compose.yml`, hace login en Docker Hub y levanta los contenedores. El pipeline lo ejecuta automáticamente después de Terraform; si se quiere correr a mano:

```powershell
ansible-playbook -i inventory.ini ansible/playbook.yml `
  -e dockerhub_username=rodr1g0258 `
  -e dockerhub_token="$env:DOCKERHUB_TOKEN" `
  -e image_tag=latest
```

## 6. Cómo demostrar y defender el proyecto

1. Abrir el portafolio: http://127.0.0.1:8080 y recorrer perfil, formación, proyectos, Zombie VR y contacto.
2. Abrir la API: http://127.0.0.1:8080/api/profile.
3. Mostrar `docker compose ps` con los tres contenedores arriba.
4. Correr los 9 tests en vivo (sección 2).
5. Abrir https://github.com/rodr1go258/portfolio-fullstack/actions y mostrar los checks verdes de `dev` y `main`.
6. Abrir `.github/workflows/pipeline.yml`, `terraform/main.tf` y `ansible/playbook.yml` para señalar cada requisito de la consigna.
