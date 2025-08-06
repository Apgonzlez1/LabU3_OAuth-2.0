# 🧪 Práctica 3 - Implementación de OAuth 2.0 para Autenticación de Terceros

**DEPARTAMENTO:** Ciencias de la Computación  
**CARRERA:** Tecnologías de la Información  
**ASIGNATURA:** Aplicaciones Distribuidas  
**NIVEL:** 7°  
**DOCENTE:** Ing. Paulo Galarza, Mgs.  
**PRÁCTICA N°:** 3  
**TEMA:** Implementación de OAuth 2.0 para Autenticación de Terceros  
**ESTUDIANTE:** Adriana Pamela González Orellana  
**PERÍODO:** 202550  
**FECHA:** Agosto 2025  

---

## 📄 Resumen

Esta práctica integra un sistema de autenticación externa utilizando OAuth 2.0 con Google como proveedor de identidad, dentro de una aplicación web construida con Node.js, Express y JWT. Se implementó el flujo de autorización delegada, configurando correctamente el proveedor de Google, asegurando el backend, generando tokens seguros y validando la recepción de los tokens en el frontend para mantener sesiones de usuario. Esta integración permite a los usuarios iniciar sesión con cuentas de Google, mejorando la experiencia y la seguridad.

**Palabras clave:** OAuth 2.0, Google, JWT, Node.js, Passport.js

---

## 1. Introducción

En el desarrollo web moderno, ofrecer una experiencia de usuario fluida y segura es esencial. OAuth 2.0 permite a los servicios delegar la autenticación a proveedores confiables, evitando la gestión de contraseñas propias y mejorando la seguridad. Esta práctica integra OAuth 2.0 en un proyecto distribuido, conectando frontend y backend mediante tokens JWT y permitiendo la autenticación de usuarios con Google.

---

## 2. Objetivos

### 2.1 Objetivo General
Comprender e implementar OAuth 2.0 para autenticación de usuarios con Google en una aplicación distribuida.

### 2.2 Objetivos Específicos
- Entender el flujo de trabajo del Authorization Code Grant.
- Configurar Google Cloud Console como proveedor de identidad.
- Adaptar un backend Node.js con Passport.js para aceptar OAuth 2.0.
- Registrar y autenticar usuarios a partir de su cuenta de Google.
- Implementar en el frontend el botón de login con Google y gestionar el JWT.
- Desplegar el frontend en Vercel y validar el flujo completo.

---

## 3. Marco Teórico

OAuth 2.0 es un estándar de autorización que permite a los usuarios compartir recursos privados entre servicios sin exponer sus credenciales. Se basa en tokens de acceso que representan la autorización concedida. Passport.js es un middleware para Node.js que facilita la integración de estrategias de autenticación, incluyendo OAuth 2.0 con proveedores como Google. JWT permite transmitir información de manera segura entre el cliente y el servidor.

---

## 4. Procedimiento

### 🔐 Paso 1: Configuración de Google Cloud Platform

1. Crear un proyecto en Google Cloud Console.
2. Configurar la pantalla de consentimiento OAuth tipo "Externo".
3. Crear credenciales de tipo ID de cliente OAuth 2.0 y agregar URI de redireccionamiento:
   - `http://localhost:3000/auth/google/callback` (y la URL de producción en Vercel).

**Ejemplo de configuración:**
![Google OAuth](src/capturas/google_oauth.png)

---

### 🚀 Paso 2: Backend en Node.js

1. Instalar dependencias:
   ```bash
   npm install passport passport-google-oauth20 dotenv jsonwebtoken
   ```
2. Configurar el archivo `.env` con las credenciales (no subir este archivo al repositorio):
   ```
   GOOGLE_CLIENT_ID=xxxxx
   GOOGLE_CLIENT_SECRET=xxxxx
   GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback
   JWT_SECRET=claveSuperSecreta
   ```
3. Configurar la estrategia Passport en `passport-setup.js`:
   ```js
   passport.use(new GoogleStrategy({
     clientID: process.env.GOOGLE_CLIENT_ID,
     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
     callbackURL: process.env.GOOGLE_CALLBACK_URL
   },
   async (accessToken, refreshToken, profile, done) => {
     const user = {
       googleId: profile.id,
       displayName: profile.displayName,
       email: profile.emails[0].value
     };
     return done(null, user);
   }));
   ```
4. Configurar rutas en `auth.routes.js`:
   ```js
   router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

   router.get('/google/callback',
     passport.authenticate('google', { session: false }),
     (req, res) => {
       const token = jwt.sign({ id: req.user.googleId, email: req.user.email }, process.env.JWT_SECRET);
       res.redirect(`https://tu-app.vercel.app/authcallback.html?token=${token}`);
   });
   ```

---

### 💬 Paso 3: Redirección al Frontend

En el archivo `authcallback.html` del frontend, leer el token de la URL y almacenarlo en `localStorage`:

```js
const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get('token');
localStorage.setItem("token", token);
```

---

### 🌐 Paso 4: Despliegue en Vercel

- Subir el frontend a GitHub e importar el proyecto en Vercel.
- Actualizar `GOOGLE_CALLBACK_URL` en el backend si es necesario para producción.

---

## 5. Estructura del Proyecto

```
LabU3_OAuth-2.0/
├── frontend/
│   ├── index.html
│   └── authcallback.html
├── src/
│   ├── api/routes/auth.routes.js
│   ├── config/passport-setup.js
│   └── capturas/
│       ├── Autenticas.png
│       ├── chat.png
│       └── vercel.png
├── .env
├── .gitignore
├── package.json
└── server.js
```

---

## 6. Análisis de Resultados

- Google OAuth 2.0 configurado correctamente.
- Flujo Authorization Code Grant implementado y probado.
- Backend generó JWT correctamente.
- Frontend recibió y almacenó el JWT para futuras solicitudes.
- El sistema desplegado en Vercel funcionó correctamente con autenticación de terceros.

---

## 7. Discusión

Se comprobó la importancia de delegar la autenticación a proveedores confiables, evitando almacenamiento de contraseñas y aumentando la seguridad. Passport.js simplifica la integración con OAuth 2.0, y la combinación JWT + frontend separado permite mantener un flujo seguro y escalable.

---

## 8. Conclusiones

- OAuth 2.0 permite delegar la autenticación a proveedores como Google.
- Passport.js agiliza la implementación de estrategias externas.
- Separar frontend y backend mediante JWT es una arquitectura moderna y segura.
- El flujo implementado mejora la seguridad y la experiencia del usuario.

---

## 9. Recomendaciones

- No subir las claves del `.env` a repositorios públicos.
- Asignar roles adecuados a los usuarios que se registren vía OAuth.
- Implementar el parámetro `state` para protegerse contra ataques CSRF.
- Agregar opción de logout que borre el JWT y revoque acceso desde el proveedor.

---

## 10. Bibliografía

- [Google Developers Identity Platform](https://developers.google.com/identity)
- [Passport.js – Simple, unobtrusive authentication](https://www.passportjs.org/)
- [JWT Introduction](https://jwt.io/introduction)
- [Vercel Documentation](https://vercel.com/docs)