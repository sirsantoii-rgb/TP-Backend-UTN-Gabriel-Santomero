/* 
Verificar que el workspace exista
Verificar que el usuario sea miembro del workspace
Verificar que tenga el rol correcto
*/
import ServerError from "../helpers/error.helpers.js"
import workspaceRepository from "../repository/workspace.repository.js"

function workspaceMiddleware(authorized_roles = []) {

    return async function (request, response, next) {
        try {
            console.log('🔍 [START] Middleware workspace', new Date().toISOString())
            
            const user_id = request.user.id
            const workspace_id = request.params.workspace_id
            
            console.log('📊 [QUERY 1] Buscando workspace...', workspace_id)
            const workspace_selected = await workspaceRepository.getById(workspace_id)
            console.log('✅ [QUERY 1] Workspace encontrado')

            if (!workspace_selected) {
                throw new ServerError('No existe ese espacio de trabajo', 404)
            }

            console.log('📊 [QUERY 2] Buscando member...')
            const member_selected = await workspaceRepository.getMemberByWorkspaceIdAndUserId(workspace_id, user_id)
            console.log('✅ [QUERY 2] Member encontrado')

            if (!member_selected) {
                throw new ServerError("No perteneces a este espacio de trabajo", 403)
            }

            //Gestionar acceso por role de miembro
            if (authorized_roles.length > 0 && !authorized_roles.includes(member_selected.role)) {
                throw new ServerError("No estas autorizado para hacer esta operacion", 403)
            }

            console.log('✅ [END] Middleware completado exitosamente')
            request.workspace = workspace_selected
            request.member = member_selected
            next()
        }
        catch (error) {
            console.log("❌ Error en workspace.middleware", error)
            /* Si tiene status decimos que es un error controlado (osea es esperable) */
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