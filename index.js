import { connectMongoDB } from "./config/mongoDB.config.js"
import express from 'express'
import authRouter from "./routes/auth.router.js"
import randomMiddleware from "./middlewares/random.middleware.js"
import cors from 'cors'
import workspaceRouter from "./routes/workspace.router.js"
import workspaceRepository from "./repository/workspace.repository.js"

connectMongoDB() 

//Crear un servidor web (Express app)
const app = express()

/* 
Esto permite que otras direcciones distintas a la nuesta puedan consultar nuestro servidor
*/
app.use(cors())

//Habilita a mi servidor a recibir json por body
/* 
lee el request.headers.['content-type'] y si el valor es 'application/json' entonces guarda en request.body el json transformado
*/
app.use(express.json())



app.use("/api/auth", authRouter)
app.use("/api/workspace", workspaceRouter)

app.listen(
    8080, 
    () => {
        console.log('Nuestra app se escucha en el puerto 8080')
    }
)