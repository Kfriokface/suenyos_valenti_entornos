# Sueños Valenti

Aplicación web desarrollada con **Node.js y Express** que implementa un sistema completo de registro, autenticación y gestión de sesiones de usuario.

El proyecto utiliza **sesiones de servidor** para mantener la autenticación, proteger rutas privadas y redirigir correctamente al usuario según su estado de login.

---

## Tecnologías usadas

- Node.js
- Express
- express-session
- EJS
- JavaScript
- nodemon (entorno de desarrollo)

---

## Estructura del proyecto

- Backend con Express
- Gestión de sesiones mediante `express-session`
- Rutas separadas para autenticación y vistas
- Middleware para proteger rutas privadas
- Motor de plantillas EJS para renderizar vistas dinámicas

---

## Funcionalidades

- Registro de usuarios con validaciones
- Login de usuarios
- Creación y mantenimiento de sesión
- Redirección automática tras registro y login
- Acceso restringido a rutas privadas (perfil)
- Logout y destrucción de sesión
- Control de errores en formularios
- Persistencia de sesión durante la navegación

---

## Cómo ejecutar el proyecto

1. Instalar dependencias:

```bash
npm install
```

2. Ejecutar en modo desarrollo (recomendado):

```bash
npm run dev
```

> Este modo utiliza **nodemon** con configuración personalizada para evitar reinicios innecesarios del servidor que puedan afectar a las sesiones.

3. Ejecutar en modo producción:

```bash
npm run start
```

4. Abrir en el navegador:

```
http://localhost:3000
```

---

## Notas importantes

- El proyecto utiliza **sesiones clásicas de servidor**, no JWT
- Durante el desarrollo se detectaron problemas al usar nodemon sin configuración adecuada
- Estos problemas se solucionaron mediante un archivo `nodemon.json`

---

## Autor

**Alberto Sancho**  
Asignatura: Desarrollo web entorno servidor  
Fecha: Enero 2026

