import { connectMongoDB } from "./config/mongoDB.config.js"
import express from 'express'
import authRouter from "./routes/auth.router.js"
import testRouter from './routes/test.router.js'
import cors from 'cors'
import workspaceRouter from "./routes/workspace.router.js"
import workspaceRepository from "./repository/workspace.repository.js"
import messagesRepository from "./repository/messages.repository.js"


console.log("=== 🚨 VERIFICANDO VARIABLES EN VERCEL ===");
console.log("GMAIL_USERNAME:", process.env.GMAIL_USERNAME || "❌ NO DEFINIDA");
console.log("GMAIL_PASSWORD:", process.env.GMAIL_PASSWORD ? "✅ DEFINIDA" : "❌ NO DEFINIDA");
console.log("URL_FRONTEND:", process.env.URL_FRONTEND || "❌ NO DEFINIDA");
console.log("JWT_SECRET_KEY:", process.env.JWT_SECRET_KEY ? "✅ DEFINIDA" : "❌ NO DEFINIDA");
console.log("MONGODB_URI:", process.env.MONGODB_URI ? "✅ DEFINIDA" : "❌ NO DEFINIDA");
console.log("=== FIN VERIFICACIÓN ===");

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

