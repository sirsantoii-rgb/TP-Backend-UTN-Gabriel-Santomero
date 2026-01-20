/* CONEXION A MONGODB */
import ENVIRONMENT from "./environment.config.js"
import mongoose from "mongoose"
/* importamos libreria de mongoose */



const connection_string = `${ENVIRONMENT.MONGO_DB_URI}/${ENVIRONMENT.MONGO_DB_NAME}`
/*  ESTE SCTING LO OBTUVE DE MONGO COMPAS *PREVIAMENTE HABER CREADO EL SERVIDOR */

export async function connectMongoDB() {
  try {
    await mongoose.connect(connection_string, {
      // ⚡ OPTIMIZACIONES PARA LATENCIA EUROPA-USA ⚡
      serverSelectionTimeoutMS: 8000,    // 8 segundos MÁXIMO para encontrar servidor
      socketTimeoutMS: 15000,           // 15 segundos MÁXIMO por operación
      connectTimeoutMS: 8000,           // 8 segundos MÁXIMO para conectar
      
      // Pool de conexiones más eficiente
      maxPoolSize: 3,                   // REDUCIDO: menos conexiones simultáneas
      minPoolSize: 1,
      maxIdleTimeMS: 10000,             // 10 segundos antes de cerrar conexión inactiva
      
      // Otras optimizaciones
      family: 4,                        // Usar solo IPv4 (más rápido)
      retryWrites: true,
      retryReads: true
    });
    
    console.log("Conexión a MongoDB exitosa");
  } catch (error) {
    console.log("Conexión con MongoDB Fallida!");
    console.log(error);
  }
}