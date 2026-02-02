import { connectMongoDB } from "./config/mongoDB.config.js"
import express from 'express'
import authRouter from "./routes/auth.router.js"
import testRouter from './routes/test.router.js'
import cors from 'cors'
import workspaceRouter from "./routes/workspace.router.js"
import workspaceRepository from "./repository/workspace.repository.js"
import messagesRepository from "./repository/messages.repository.js"


const app = express()


const allowedOrigins = [
  "https://tp-frontend-back-gabriel-santomero-opal.vercel.app",
  "https://tp-frontend-back-gabriel-santomero-rosy.vercel.app"
]

app.use(cors({
  origin: function(origin, callback){
    
    if(!origin) return callback(null, true)
    if(allowedOrigins.includes(origin)){
      callback(null, true)
    } else {
      callback(new Error("CORS no permitido"))
    }
  },
  credentials: true
}))

app.use(express.json())

// ----- Routers -----
app.use("/api/auth", authRouter)
app.use("/api/workspace", workspaceRouter)
app.use("/api/test", testRouter)

// ----- Conectar MongoDB y arrancar servidor -----
connectMongoDB()
  .then(() => {
    console.log("MongoDB listo, arrancando servidor...")
    const port = process.env.PORT || 8080
    app.listen(port, () => console.log(`🚀 Servidor escuchando en puerto ${port}`))
  })
  .catch(err => {
    console.error("💥 No se pudo conectar a MongoDB, servidor detenido")
  })

