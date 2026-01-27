
import { connectMongoDB } from "./config/mongoDB.config.js"
import express from 'express'
import authRouter from "./routes/auth.router.js"
import testRouter from './routes/test.router.js'
import cors from 'cors'
import workspaceRouter from "./routes/workspace.router.js"
import workspaceRepository from "./repository/workspace.repository.js"

const app = express()

// Middleware
app.use(cors({origin: "https://tp-frontend-back-gabriel-santomero-opal.vercel.app",
  credentials: true}))
app.use(express.json())

// Routers
app.use("/api/auth", authRouter)
app.use("/api/workspace", workspaceRouter)
app.use("/api/test", testRouter)

// Conectar MongoDB y arrancar servidor
connectMongoDB()
  .then(() => {
    console.log("MongoDB listo, arrancando servidor...")
    const port = process.env.PORT || 8080
    app.listen(port, () => console.log(`🚀 Servidor escuchando en puerto ${port}`))
  })
  .catch(err => {
    console.error("💥 No se pudo conectar a MongoDB, servidor detenido")
  })

/* mail_transporter.sendMail({
    from: ENVIRONMENT.GMAIL_USERNAME,
    to: ENVIRONMENT.GMAIL_USERNAME,
    subject: 'Probando nodemailer',
    html: `<h1>Probando nodemailer</h1>`
}) */

/* 
//Quiero crear un espacio de trabajo de prueba
*/

/* async function crearEspacioDeTrabajo (){

    //Creo el espacio de trabajo de prueba
    const workspace = await workspaceRepository.create(
        '69664b767fa3b6ffd51dcd7b', //Remplazen por su id
        'test',
        'https://images.pexels.com/photos/414612/pexels-photo-414612.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        'Descripcion del espacio de trabajo'
    )
    //Me agrego como miembro
    await workspaceRepository.addMember(workspace._id, '69664b767fa3b6ffd51dcd7b' //Remplazen por su id, 'Owner')
}

crearEspacioDeTrabajo() */

/* 
1ero:
    Crear espacio de trabajo
    Agregar miembro

2do: Crear endpoint para obtener espacios de trabajo asociados al usuario
3ro: Probar con postman
*/