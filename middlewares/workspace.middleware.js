import ServerError from "../helpers/error.helpers.js"
import workspaceRepository from "../repository/workspace.repository.js"
import mongoose from "mongoose"

function workspaceMiddleware(authorized_roles = []) {

    return async function (request, response, next) {
        try {

            const user_id = request.user.id
            const workspace_id = request.params.workspace_id

            console.log("Middleware start")

            // 1. VALIDAR OBJECT ID
            if (!mongoose.Types.ObjectId.isValid(workspace_id)) {
                throw new ServerError("ID de workspace inválido", 400)
            }

            console.log("ID válido")

            // 2. BUSCAR WORKSPACE
            const workspace_selected = await workspaceRepository.getById(workspace_id)
            console.log("Workspace buscado")

            if (!workspace_selected) {
                throw new ServerError('No existe ese espacio de trabajo', 404)
            }

            // 3. BUSCAR MEMBRESÍA
            const member_selected = await workspaceRepository.getMemberByWorkspaceIdAndUserId(
                workspace_id,
                user_id
            )
            console.log("Membresía buscada")

            if (!member_selected) {
                throw new ServerError("No perteneces a este espacio de trabajo", 403)
            }

            // 4. VALIDAR ROL
            if (authorized_roles.length > 0 && !authorized_roles.includes(member_selected.role)) {
                throw new ServerError("No estas autorizado para hacer esta operacion", 403)
            }

            // 5. SET REQUEST
            request.workspace = workspace_selected
            request.member = member_selected

            console.log("Middleware OK")
            next()
        }
        catch (error) {
            console.log("Error en workspace.middleware", error)

            if (error.status) {
                return response.json({
                    status: error.status,
                    ok: false,
                    message: error.message,
                    data: null
                })
            }

            return response.json({
                ok: false,
                status: 500,
                message: "Error interno del servidor",
                data: null
            })
        }
    }
}

export default workspaceMiddleware
