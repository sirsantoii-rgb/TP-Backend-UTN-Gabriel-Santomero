/* CONEXION A MONGODB */
import ENVIRONMENT from "./environment.config.js"
import mongoose from "mongoose"
/* importamos libreria de mongoose */



const connection_string = `${ENVIRONMENT.MONGO_DB_URI}/${ENVIRONMENT.MONGO_DB_NAME}`
/*  ESTE SCTING LO OBTUVE DE MONGO COMPAS *PREVIAMENTE HABER CREADO EL SERVIDOR */

 export async function connectMongoDB () {
    try{
        /* bloque de codigo a ejecutar */
        await mongoose.connect(
            connection_string /* {connectTimeoutMS} */
        )
        console.log("conexion a mongoDB exitosoooo")
    }
    catch(error){
        console.log("Conexion con MongoDB Fallida! Error!")
        console.log(error)
    }
}