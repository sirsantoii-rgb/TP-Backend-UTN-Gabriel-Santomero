API REST construida con Node.js, Express y MongoDB que implementa un sistema de autenticación JWT y CRUD para entidades protegidas.

Registro de usuarios con verificación por email:

- Login con JWT (JSON Web Tokens)
- Middleware de autenticación para rutas protegidas
- CRUD completo de entidades (solo accesible por usuarios autenticados)
- Validación de datos y manejo de errores
- Deploy en la nube (Vercel/Render/Railway) 




Requisitos Previos:

- Node.js 
- MongoDB 
- npm 
- Servicio de Vercel.



Instalación:

npm install (instala todas las dependencias:
    "bcrypt": "^6.0.0",
    "cors": "^2.8.5",
    "dotenv": "^17.2.3",
    "express": "^5.2.1",
    "jsonwebtoken": "^9.0.3",
    "mongoose": "^9.0.1",
    "nodemailer": "^7.0.12")

correr con: "start": "node main.js",
            "dev": "node --watch main.js"