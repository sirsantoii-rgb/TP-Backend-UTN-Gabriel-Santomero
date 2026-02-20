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

    
    async update(channel_id, workspace_id, name){
        return await Channel.findOneAndUpdate(
            { _id: channel_id, fk_id_workspace: workspace_id }, 
            { name: name },
            { new: true } 
        )
    }

    
    async delete(channel_id, workspace_id){
    const result = await Channel.findOneAndDelete({
        _id: channel_id, 
        fk_id_workspace: workspace_id 
    })
    console.log(' Resultado de eliminación:', result) 
    return result
}
}

const channelRepository = new ChannelRepository()
export {channelRepository}