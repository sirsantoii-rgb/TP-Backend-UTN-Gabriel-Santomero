import mongoose from "mongoose"
import ENVIRONMENT from "./environment.config.js"
/* CONEXION CON MONGODB */

const connection_string = `${ENVIRONMENT.MONGO_DB_URI}/${ENVIRONMENT.MONGO_DB_NAME}`

export const connectMongoDB = async () => {
  try {
    const uri = process.env.MONGO_DB_URI
    if (!uri) throw new Error("❌ MONGO_DB_URI no definida en las variables de entorno")

    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000  // 10s timeout
    })

    console.log("✅ MongoDB conectado correctamente")
  } catch (error) {
    console.error("❌ ERROR MongoDB:", error)
    throw error
  }
}