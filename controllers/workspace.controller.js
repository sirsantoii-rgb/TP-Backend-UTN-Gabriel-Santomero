import ENVIRONMENT from "../config/environment.config.js"
import mail_transporter from "../config/mail.config.js"
import ServerError from "../helpers/error.helpers.js"
import userRepository from "../repository/user.repository.js"
import workspaceRepository from "../repository/workspace.repository.js"

import jwt from 'jsonwebtoken'

class WorkspaceController {
    async getWorkspaces(request, response) {
        //Quiero obtener los espacios de trabajo asociados al cliente que hace la consulta
        console.log("El usuario logueado es: ", request.user) //request.user
        const user_id = request.user.id
        const workspaces = await workspaceRepository.getWorkspacesByUserId(user_id)
        response.json({
            ok: true,
            data: {
                workspaces
            }
        })
    }

    async create(request, response) {
        const { title, image, description } = request.body
        const user_id = request.user.id
        const workspace = await workspaceRepository.create(user_id, title, image, description)
        await workspaceRepository.addMember(workspace._id, user_id, 'Owner')
        response.json({
            ok: true,
            data: {
                workspace
            }
        })
    }


    async delete(request, response) {
        try {
            const user_id = request.user.id
            const { workspace_id } = request.params

            const workspace_selected = await workspaceRepository.getById(workspace_id)
            if (!workspace_selected) {
                throw new ServerError('No existe ese espacio de trabajo', 404)
            }
            const member_info = await workspaceRepository.getMemberByWorkspaceIdAndUserId(workspace_id, user_id)
            if (member_info.role !== 'Owner') {
                throw new ServerError('No tienes permiso para eliminar este espacio de trabajo', 403)
            }
            await workspaceRepository.delete(workspace_id)
            response.json({
                ok: true,
                message: 'Espacio de trabajo eliminado correctamente',
                data: null,
                status: 200
            })
        }
        catch (error) {
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

    async addMemberRequest(request, response) {
        try {
            const {email, role} = request.body
            const workspace = request.workspace

            console.log({workspace})
            const user_to_invite = await userRepository.buscarUnoPorEmail(email)
            if(!user_to_invite){
                throw new ServerError('El email del invitado no existe.', 404)
            }

            const already_member = await workspaceRepository.getMemberByWorkspaceIdAndUserId(workspace._id, user_to_invite._id)


            if(already_member){
                throw new ServerError('El usuario ya es miembro de este espacio de trabajo', 400)
            }

            const token = jwt.sign(
                {
                    id: user_to_invite._id,
                    email,
                    workspace: workspace._id,
                    role
                },
                ENVIRONMENT.JWT_SECRET_KEY
            )

            await mail_transporter.sendMail(
                {
                    to: email,
                    from: ENVIRONMENT.GMAIL_USERNAME,
                    subject: `Has sido invitado a ${workspace.title}`,
                    html: `
                        <h1>Has sido invitado a participar en el espacio de trabajo: ${workspace.title}</h1>
                        <p>Si no reconoces esta invitacion por favor desestima este mail</p>
                        <p>Da click a 'aceptar invitacion' para aceptar la invitacion</p>
                        <a
                        href='https://tp-backend-utn-gabriel-santomero.vercel.app/api/workspace/${workspace._id}/members/accept-invitation?invitation_token=${token}'
                        >Aceptar invitacion</a>
                    `
                }
            )

            return response.json(
                {
                    status: 201,
                    ok: true, 
                    message: "invitacion enviada",
                    data: null
                }
            )

        }
        catch (error) {
            console.log("Error en addMember", error)
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

    async acceptInvitation(request, response) {
    try {
        const { invitation_token } = request.query;

        // 1. Validar y decodificar el Token
        const payload = jwt.verify(invitation_token, ENVIRONMENT.JWT_SECRET_KEY);
        
        // IMPORTANTE: En addMemberRequest guardaste el campo como 'workspace'
        // Así que aquí lo extraemos como 'workspace'
        const { id, workspace, role } = payload; 

        console.log("Datos del token decodificados:", { id, workspace, role });

        // 2. Usamos 'workspace' (que es el ID) para buscar y agregar
        const already_member = await workspaceRepository.getMemberByWorkspaceIdAndUserId(workspace, id);

        if (!already_member) {
            // Guardamos usando los datos seguros del token
            await workspaceRepository.addMember(workspace, id, role);
            console.log(`¡Éxito! Usuario ${id} agregado al workspace ${workspace}`);
        } else {
            console.log("El usuario ya era miembro.");
        }

        // 3. Redirección al Front
        return response.redirect(`https://tp-frontend-back-gabriel-santomero-opal.vercel.app/`);

    } catch (error) {
        console.error("Error al aceptar invitación:", error);
        return response.redirect(`https://tp-frontend-back-gabriel-santomero-opal.vercel.app/login?error=invalid_token`);
    }
}
    async getById (request, response){
        try{
            const {workspace, member} = request
            response.json({
                ok: true,
                status: 200,
                data: {
                    workspace,
                    member
                },
                message:'Espacio de trabajo seleccionado'
            })
        }
        catch(error){
            console.log({error})
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

    //UTILIZAR ELIMINAR MIEMBRO DE UN ESPACIO DE TRABAJOO
    async deleteMember(request, response) {
    try {
        const { workspace_id, member_id } = request.params
        const current_user_id = request.user.id
        
        // 1. Verificar que el usuario actual es owner
        const isOwner = await workspaceRepository.isUserOwner(workspace_id, current_user_id)
        if (!isOwner) {
            return response.status(403).json({
                ok: false,
                message: 'Solo el owner puede eliminar miembros'
            })
        }
        
        // 2. Eliminar el miembro
        await workspaceRepository.removeMember(member_id)
        
        // 3. Responder
        return response.json({
            ok: true,
            message: 'Miembro eliminado exitosamente'
        })
        
    } catch (error) {
        return response.status(500).json({
            ok: false,
            message: 'Error al eliminar miembro'
        })
    }

    
}

async getMembers(request, response) {
    try {
        const { workspace_id } = request.params;
        // Usamos el método 7 que ya tenías en tu repositorio
        const members = await workspaceRepository.getWorkspaceMembers(workspace_id);
        
        response.json({
            ok: true,
            status: 200,
            data: {
                members
            }
        });
    } catch (error) {
        response.status(500).json({
            ok: false,
            message: "Error al obtener los miembros"
        });
    }
}
//ACTUALIZAR EL ROL DE UN MIEMBRE DELK GRUPO 
async updateMemberRole(request, response) {
    try {
        const { workspace_id, member_id } = request.params
        const { role } = request.body
        const current_user_id = request.user.id
        
        // 1. Validar que el rol es válido
        const validRoles = ['admin', 'member', 'guest']
        if (!validRoles.includes(role)) {
            return response.status(400).json({
                ok: false,
                message: 'Rol inválido. Usa: admin, member o guest'
            })
        }
        
        // 2. Verificar permisos
        const isOwner = await workspaceRepository.isUserOwner(workspace_id, current_user_id)
        if (!isOwner) {
            return response.status(403).json({
                ok: false,
                message: 'Solo el owner puede cambiar roles'
            })
        }
        
        // 3. Actualizar rol
        const updatedMember = await workspaceRepository.updateMemberRole(member_id, role)
        
        // 4. Responder
        return response.json({
            ok: true,
            message: 'Rol actualizado exitosamente',
            data: {
                member_id: updatedMember._id,
                user_id: updatedMember.fk_id_user,
                role: updatedMember.role
            }
        })
        
    } catch (error) {
        return response.status(500).json({
            ok: false,
            message: 'Error al actualizar rol'
        })
    }
}
}

const workspaceController = new WorkspaceController()
export default workspaceController