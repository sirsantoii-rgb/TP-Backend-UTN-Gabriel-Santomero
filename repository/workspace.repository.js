import MemberWorkspace from "../models/MemberWorkspace.model.js";
import Workspace from "../models/Workspace.model.js";

class WorkspaceRepository {

    async getById (workspace_id){
        return await Workspace.findById(workspace_id)
    }
    async getWorkspacesByUserId(user_id){
        //Busco a todos los miembros que pertenezcan al usuario
        //Esto seria buscar todas mis membresias
        const workspaces = await MemberWorkspace.find({fk_id_user: user_id})
        .populate({
            path: 'fk_id_workspace',
            match: {active: true}
        }) //Esto permite expandir sobre la referencia a la tabla de espacios de trabajo


        const members_workspace = workspaces.filter((member) => member.fk_id_workspace !== null) 
        return members_workspace.map(
            (member_workspace) => {
                return {
                    member_id: member_workspace._id,
                    member_role: member_workspace.role,
                    member_id_user: member_workspace.fk_id_user,
                    workspace_image: member_workspace.fk_id_workspace.image,
                    workspace_title: member_workspace.fk_id_workspace.title,
                    workspace_id: member_workspace.fk_id_workspace._id
                    
                }
            }
        )
    }
    async create (fk_id_owner, title, image, description){
        const workspace = await Workspace.create({
            fk_id_owner,
            title,
            image,
            description
        })
        return workspace
    }

    async addMember (workspace_id, user_id, role){
    // Usamos create, pero nos aseguramos de que los nombres de los campos
    // sean exactamente los mismos que usas en el find() de getWorkspacesByUserId
    const member = await MemberWorkspace.create({
        fk_id_workspace: workspace_id,
        fk_id_user: user_id, // Asegúrate que en el JWT este 'id' sea el _id de MongoDB
        role: role
    })
    return member
}

    //Obtener miembro de un espacio de trabajo por id de espacio de trabajo y id de usuario
    async getMemberByWorkspaceIdAndUserId(workspace_id, user_id){
        const member = await MemberWorkspace.findOne({fk_id_workspace: workspace_id, fk_id_user: user_id})
        return member
    }

    async delete(workspace_id){
        await Workspace.findByIdAndUpdate(workspace_id, {active: false})
    }

    // 1. Actualizar espacio de trabajo (para PUT /:workspace_id)
    async updateWorkspace(workspace_id, updateData) {
        return await Workspace.findByIdAndUpdate(
            workspace_id,
            updateData,
            { new: true } 
        )
    }

    // 2. Eliminar miembro por ID de miembro (para DELETE /:workspace_id/members/:member_id)
    async removeMember(member_id) {
        return await MemberWorkspace.findByIdAndDelete(member_id)
    }

    // 3. Eliminar miembro por workspace_id y user_id (alternativa útil)
    async removeMemberByUser(workspace_id, user_id) {
        return await MemberWorkspace.findOneAndDelete({
            fk_id_workspace: workspace_id,
            fk_id_user: user_id
        })
    }

    // 4. Actualizar rol de miembro (para PUT /:workspace_id/members/:member_id)
    async updateMemberRole(member_id, newRole) {
        return await MemberWorkspace.findByIdAndUpdate(
            member_id,
            { role: newRole },
            { new: true }
        )
    }

    // 5. Obtener miembro por ID de miembro (útil para validaciones)
    async getMemberById(member_id) {
        return await MemberWorkspace.findById(member_id).populate('fk_id_user')
    }

    // 6. Verificar si usuario es owner del workspace
    async isUserOwner(workspace_id, user_id) {
        const workspace = await Workspace.findById(workspace_id)
        if (!workspace) return false
        return workspace.fk_id_owner.toString() === user_id.toString()
    }

    // 7. Obtener todos los miembros de un workspace
    async getWorkspaceMembers(workspace_id) {
        return await MemberWorkspace.find({ 
            fk_id_workspace: workspace_id 
        }).populate('fk_id_user', 'email username') 
    }
}

const workspaceRepository = new WorkspaceRepository()
export default workspaceRepository