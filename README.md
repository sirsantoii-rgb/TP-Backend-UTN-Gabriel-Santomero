Una aplicación web hecha con Node.js que permite registrarse, iniciar sesión de forma segura.
En la aplicacion se puede:
1- Registrar
2- Loguear el usuario
3- Resetear la contraseña y cambiarla
4- crear y borrar espacios de trabajo (y ver cuantos miembros hay en un espacio)
5- crear canales, borrarlos, cambiar nombre de canal.
6- Agergar miembros a un canal ( 1- envio de email a un usuario ya registrado para participar del espacio, 2- acepta el email y vera el espacio de trabajo en su cuenta)

Registro de usuarios con verificación por email:

- Login con JWT (JSON Web Tokens)
- Middleware de autenticación para rutas protegidas
- Validación de datos y manejo de errores
- Deploy en la nube (en el servidor de Vercel) 




Requisitos Previos:

- Node.js 
- MongoDB 
- npm 




Instalación:

npm install (instala todas las dependencias que usamos en la cursada:
    "bcrypt": "^6.0.0",
    "cors": "^2.8.5",
    "dotenv": "^17.2.3",
    "express": "^5.2.1",
    "jsonwebtoken": "^9.0.3",
    "mongoose": "^9.0.1",
    "nodemailer": "^7.0.12")

correr con: npm run dev

Endpoints con postman:

registrar: Post {{URL_API}}/api/auth/register
Login: Post {{URL_API}}/api/auth/login
verificar email: Get {{URL_API}}/api/auth/verify-email
Resetear contraseña: Post {{URL_API}}/api/auth/forgot-Password
cambiar contraseña: Post {{URL_API}}/api/auth/reset-password

Obtener espacios de trabajo: Get {{URL_API}}/api/workspace
Ver miembros de un espacio de trabajo: Get {{URL_API}}/api/workspace/:workspace_id/members
Obtener ide de espacio: Get {{URL_API}}/api/workspace/:workspace_id

Obtener canales: Get {{URL_API}}/api/workspace/:workspace_id/channels
Crear Canal: Post {{URL_API}}/api/workspace/:workspace_id/channels

enviar mensajes: Post {{URL_API}}/api/workspace/:workspace_id/channels/:channel_id/messages
Ver mensajes: Get {{URL_API}}/api/workspace/:workspace_id/channels/:channel_id/messages