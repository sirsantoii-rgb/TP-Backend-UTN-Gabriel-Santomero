import MemberWorkspace from "../models/MemberWorkspace.model.js";
import Workspace from "../models/Workspace.model.js";

class WorkspaceRepository {

    async getById (workspace_id){
        return await Workspace.findById(workspace_id)
    }
    async getWorkspacesByUserId(user_id) {
    
    const memberships = await MemberWorkspace.find({ fk_id_user: user_id })
        .populate({
            path: 'fk_id_workspace',
            match: { active: true }
        });

    
    const members_workspace = memberships.filter((member) => member.fk_id_workspace !== null);

    
    return await Promise.all(
        members_workspace.map(async (member_workspace) => {
            
            
            const contador = await MemberWorkspace.countDocuments({ 
                fk_id_workspace: member_workspace.fk_id_workspace._id 
            });

            return {
                member_id: member_workspace._id,
                member_role: member_workspace.role,
                member_id_user: member_workspace.fk_id_user,
                workspace_image: member_workspace.fk_id_workspace.image,
                workspace_title: member_workspace.fk_id_workspace.title,
                workspace_id: member_workspace.fk_id_workspace._id,
                
                members_count: contador 
            };
        })
    );
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
    
    const member = await MemberWorkspace.create({
        fk_id_workspace: workspace_id,
        fk_id_user: user_id, 
        role: role
    })
    return member
}

    
    async getMemberByWorkspaceIdAndUserId(workspace_id, user_id){
        const member = await MemberWorkspace.findOne({fk_id_workspace: workspace_id, fk_id_user: user_id})
        return member
    }

    async delete(workspace_id){
        await Workspace.findByIdAndUpdate(workspace_id, {active: false})
    }

    
    async updateWorkspace(workspace_id, updateData) {
        return await Workspace.findByIdAndUpdate(
            workspace_id,
            updateData,
            { new: true } 
        )
    }

    
    async removeMember(member_id) {
        return await MemberWorkspace.findByIdAndDelete(member_id)
    }

        async removeMemberByUser(workspace_id, user_id) {
        return await MemberWorkspace.findOneAndDelete({
            fk_id_workspace: workspace_id,
            fk_id_user: user_id
        })
    }

    
    async updateMemberRole(member_id, newRole) {
        return await MemberWorkspace.findByIdAndUpdate(
            member_id,
            { role: newRole },
            { new: true }
        )
    }

    
    async getMemberById(member_id) {
        return await MemberWorkspace.findById(member_id).populate('fk_id_user')
    }

    
    async isUserOwner(workspace_id, user_id) {
        const workspace = await Workspace.findById(workspace_id)
        if (!workspace) return false
        return workspace.fk_id_owner.toString() === user_id.toString()
    }

    
    async getWorkspaceMembers(workspace_id) {
        return await MemberWorkspace.find({ 
            fk_id_workspace: workspace_id 
        }).populate('fk_id_user', 'email username') 
    }
}

const workspaceRepository = new WorkspaceRepository()
export default workspaceRepository