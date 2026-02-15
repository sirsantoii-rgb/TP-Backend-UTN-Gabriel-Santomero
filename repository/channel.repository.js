import Channel from "../models/Channels.model.js"

class ChannelRepository {
    async create(workspace_id, name){
        return await Channel.create({name: name, fk_id_workspace: workspace_id})
    }

    async getAllByWorkspaceId(workspace_id){
        return await Channel.find({fk_id_workspace: workspace_id})
    }

    async getByIdAndWorkspaceId(channel_id, workspace_id){
        return await Channel.findOne({_id: channel_id, fk_id_workspace: workspace_id})
    }

    // NUEVA: Para renombrar el canal
    async update(channel_id, workspace_id, name){
        return await Channel.findOneAndUpdate(
            { _id: channel_id, fk_id_workspace: workspace_id }, // Filtro de seguridad
            { name: name },
            { new: true } // Para que devuelva el canal ya modificado
        )
    }

    // NUEVA: Para eliminar el canal
    async delete(channel_id, workspace_id){
        return await Channel.findOneAndDelete({
            _id: channel_id, 
            fk_id_workspace: workspace_id 
        })
    }
}

const channelRepository = new ChannelRepository()
export {channelRepository}