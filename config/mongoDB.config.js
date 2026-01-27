import mongoose from "mongoose"
import ENVIRONMENT from "./environment.config.js"
/* CONEXION CON MONGODB */

const connection_string = `${ENVIRONMENT.MONGO_DB_URI}/${ENVIRONMENT.MONGO_DB_NAME}`

export const connectMongoDB = async () => {
  try {
    const uri = process.env.MONGO_DB_URI

    if (!uri) {
      throw new Error("❌ MONGO_DB_URI no definida en las variables de entorno")
    }

    // Conectamos a MongoDB
    await mongoose.connect(uri, {
      // useNewUrlParser y useUnifiedTopology ya no se usan en Mongoose 7+
      serverSelectionTimeoutMS: 10000 // espera máxima 10s para la conexión
    })

    console.log("✅ MongoDB conectado correctamente")
  } catch (error) {
    console.error("❌ ERROR MongoDB:", error)
    throw error // para que el servidor no arranque si no hay DB
  }
}