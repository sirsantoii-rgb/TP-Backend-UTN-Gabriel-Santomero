import MemberWorkspace from "../models/MemberWorkspace.model.js";
import Workspace from "../models/Workspace.model.js";
import mongoose from "mongoose";

class WorkspaceRepository {

    async getById(workspace_id) {
        // Validar que sea un ObjectId válido antes de consultar
        if (!mongoose.Types.ObjectId.isValid(workspace_id)) {
            return null;
        }
        return await Workspace.findById(workspace_id).lean();
    }

    async getWorkspacesByUserId(user_id){
        const workspaces = await MemberWorkspace.find({fk_id_user: user_id})
        .populate({
            path: 'fk_id_workspace',
            match: {active: true}
        })
        .lean();

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

    async create(fk_id_owner, title, image, description){
        const workspace = await Workspace.create({
            fk_id_owner,
            title,
            image,
            description
        })
        return workspace
    }

    async addMember(workspace_id, user_id, role){
        const member = await MemberWorkspace.create({
            fk_id_workspace: workspace_id,
            fk_id_user: user_id,
            role
        })
        return member
    }

    async getMemberByWorkspaceIdAndUserId(workspace_id, user_id){
        // Validar ObjectIds antes de consultar
        if (!mongoose.Types.ObjectId.isValid(workspace_id) || !mongoose.Types.ObjectId.isValid(user_id)) {
            return null;
        }
        const member = await MemberWorkspace.findOne({
            fk_id_workspace: workspace_id, 
            fk_id_user: user_id
        }).lean();
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
        ).lean();
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
        ).lean();
    }

    async getMemberById(member_id) {
        return await MemberWorkspace.findById(member_id)
            .populate('fk_id_user')
            .lean();
    }

    async isUserOwner(workspace_id, user_id) {
        const workspace = await Workspace.findById(workspace_id).lean();
        if (!workspace) return false
        return workspace.fk_id_owner.toString() === user_id.toString()
    }

    async getWorkspaceMembers(workspace_id) {
        return await MemberWorkspace.find({ 
            fk_id_workspace: workspace_id 
        })
        .populate('fk_id_user', 'email username')
        .lean();
    }
}

const workspaceRepository = new WorkspaceRepository()
export default workspaceRepository