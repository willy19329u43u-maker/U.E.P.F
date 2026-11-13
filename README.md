# U.E. Paulo Freire — Plataforma Web v5

Sistema web de gestión escolar para la Unidad Educativa "Paulo Freire" (Distrito 2, Sacaba, Cochabamba, Bolivia). Permite la consulta de asistencia, atrasos, calificaciones, horarios y comunicados, con acceso diferenciado por roles (administrador, secretaría, docente, estudiante y padre/tutor).

## 📋 Características

- 5 roles con permisos granulares y paletas visuales diferenciadas
- Asistencia simplificada (asiste, falta, retraso, licencia, retirado)
- Calificaciones tipo Excel con edición inline por trimestres
- Horarios adaptativos según el rol del usuario
- Avisos y comunicados segmentados por destino
- Perfil editable (nombre, email, foto, contraseña)
- Impresión oficial: libreta académica y listas de asistencia
- Buscador global con filtro por rol
- Seguridad: hash PBKDF2-SHA256 (120k iteraciones), CSRF, rate-limiting, auditoría
- Soporte multilingüe (i18n) y tema claro/oscuro

## 🛠 Stack tecnológico

- **Backend:** PHP 8.x (Mini-MVC propio)
- **Base de datos:** MySQL / MariaDB (PDO)
- **Frontend:** HTML5, CSS3, JavaScript (vanilla)
- **Servidor:** Apache (XAMPP / WAMP / LAMP)

## 🚀 Instalación rápida

### Requisitos
- XAMPP (Apache + MySQL + PHP 8.x) o equivalente
- Navegador web moderno
- phpMyAdmin para la base de datos

### Pasos
1. Clona este repositorio:
   ```bash
   git clone https://github.com/TU_USUARIO/ue_paulo_freire_web.git
   ```
2. Copia la carpeta al directorio de tu servidor web, por ejemplo `C:\xampp\htdocs\ue_paulo_freire_web`.
3. Inicia Apache y MySQL desde el panel de control de XAMPP.
4. Abre `http://localhost/phpmyadmin`.
5. Crea la base de datos `ue_paulo_freire` (codificación `utf8mb4_unicode_ci`).
6. Importa el archivo `database.sql` (pestaña SQL, **NO** la pestaña "Importar" por el DELIMITER).
7. Copia `.env.example` a `.env` y revisa las credenciales de la base de datos:
   ```bash
   copy .env.example .env   # Windows
   cp .env.example .env     # Linux/macOS
   ```
8. Abre el navegador: `http://localhost/ue_paulo_freire_web/`

### Verificación
- `http://localhost/ue_paulo_freire_web/check.php` → debe mostrar "Conexión Exitosa" y listar las tablas.
- `http://localhost/ue_paulo_freire_web/fix_login.php` → debe mostrar 5 "✔ VERIFICA CORRECTAMENTE".

## 🔑 Credenciales de prueba

| Usuario | Contraseña | Rol |
|---------|-----------|-----|
| admin | Admin123! | Administrador |
| secretaria | Secretaria123! | Secretaría |
| docente | Docente123! | Docente |
| estudiante | Estudiante123! | Estudiante |
| padre | Padre123! | Padre/Tutor |

Cada usuario debe cambiar su contraseña en el primer ingreso.

## 🌐 Versión para GitHub Pages (demo estática)

⚠️ **Importante:** GitHub Pages es hosting estático (solo HTML, CSS, JS). **No ejecuta PHP ni MySQL.**

Por ello, el repositorio incluye una **versión demo funcional en `/docs/`** que se puede ejecutar directamente en GitHub Pages usando el mismo diseño visual del proyecto original. Los archivos `.php` originales se conservan en el repositorio como código fuente (para desplegar en un servidor con PHP/MySQL, como XAMPP).

### Activar GitHub Pages

1. Sube este repositorio a GitHub.
2. Ve a **Settings → Pages**.
3. En **Build and deployment → Source**, selecciona **Deploy from a branch**.
4. En **Branch**, elige `main` y en **Folder**, selecciona `/docs`.
5. Haz clic en **Save**.
6. Tu sitio estará disponible en `https://TU_USUARIO.github.io/ue_paulo_freire_web/`.

### ¿Qué incluye la versión demo estática?

- Página de inicio con características del proyecto
- Login simulado con los 5 roles (admin, secretaría, docente, estudiante, padre)
- Panel de control (dashboard) con datos de ejemplo por rol
- Navegación lateral, cambio de tema claro/oscuro y cerrar sesión
- Misma paleta de colores y estilos visuales del proyecto original

### ¿Qué NO funciona en la versión estática?

- Conexión real a base de datos MySQL
- Registro real de asistencia, calificaciones o comunicados
- Envío de correos electrónicos (SMTP)
- Archivos `.php` (no se ejecutan en GitHub Pages)

Para el sistema completo y funcional, sigue la instalación local con XAMPP usando `database.sql` y los archivos `.php`.

---

## 📁 Estructura del proyecto

```
ue_paulo_freire_web/
├── .env.example          # Plantilla de variables de entorno
├── .gitignore            # Archivos ignorados por Git
├── database.sql          # Esquema y datos iniciales de MySQL
├── index.php             # Punto de entrada (landing)
├── login.php / logout.php
├── check.php             # Verificación de conexión a BD
├── fix_login.php / fix_session.php
├── config/               # Configuración global y permisos
├── core/                 # Núcleo (DB, seguridad, sesión, i18n, mailer)
├── controllers/          # Controladores MVC
├── models/               # Modelos de datos (PDO)
├── views/                # Vistas HTML/PHP
├── assets/               # CSS, JS e imágenes
└── README.md
```

## 🤝 Contribución

Las contribuciones son bienvenidas. Por favor:

1. Haz un fork del repositorio.
2. Crea una rama para tu feature: `git checkout -b feature/nombre`.
3. Realiza tus cambios y confirma: `git commit -m "feat: descripción"`.
4. Sube tu rama: `git push origin feature/nombre`.
5. Abre un Pull Request.

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Consulta el archivo [LICENSE](LICENSE) para más detalles.

## 👥 Autores

Proyecto de Innovación — Bachillerato Técnico Humanístico en Sistemas Informáticos (2026)

Autores base: Noelia Flores López & Juan Daniel Virreira Prado

## 📞 Soporte

Para dudas o reportes de errores, abre un [Issue](https://github.com/TU_USUARIO/ue_paulo_freire_web/issues) en este repositorio.
