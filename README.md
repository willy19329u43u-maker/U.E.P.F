# U.E. Paulo Freire — Plataforma Web v5

Sistema de gestión escolar para la Unidad Educativa "Paulo Freire" (Sacaba, Cochabamba, Bolivia).

## 🌐 Versión en GitHub Pages (funciona directo, sin instalar nada)

Este repositorio incluye una versión estática lista para usar en **GitHub Pages** (sin necesidad de XAMPP, PHP ni MySQL).

### Cómo activarla
1. Ve a tu repositorio en GitHub → **Settings → Pages**.
2. En **Source**, selecciona **Deploy from a branch**.
3. Elige **Branch: `main`** y **Folder: `/docs`**.
4. Haz clic en **Save**.

Tu sitio estará en: `https://willy19329u43u-maker.github.io/U.E.P.F/`

## 🔑 Credenciales de prueba (demo)

| Usuario | Contraseña | Rol |
|---------|-----------|-----|
| admin | Admin123! | Administrador |
| secretaria | Secretaria123! | Secretaría |
| docente | Docente123! | Docente |
| estudiante | Estudiante123! | Estudiante |
| padre | Padre123! | Padre/Tutor |

## 📁 Estructura

- `docs/` — Versión estática para GitHub Pages (HTML/JS, usa localStorage)
- `*.php`, `config/`, `controllers/`, `models/`, `views/`, `database.sql` — Código fuente original para servidor con PHP + MySQL (XAMPP)

## ⚠️ Nota

GitHub Pages es hosting estático (solo HTML, CSS, JS). No ejecuta PHP ni MySQL. La versión en `/docs/` simula los datos con `localStorage` del navegador.
