import { channelRepository } from "../repository/channel.repository.js"

class ChannelController {
    async getAllByWorkspaceId(request, response) {
        try {
            const { workspace_id } = request.params
            const channels = await channelRepository.getAllByWorkspaceId(workspace_id)
            response.json({
                status: 200,
                ok: true,
                message: 'Canales obtenidos con éxito',
                data: { channels }
            })
        } catch (error) {
            this.handleError(error, response);
        }
    }

    async create(request, response) {
        try {
            const { name } = request.body
            const { workspace_id } = request.params
            const channel_created = await channelRepository.create(workspace_id, name)
            response.json({
                status: 201,
                ok: true,
                message: 'Canal creado con éxito',
                data: { channel_created }
            })
        } catch (error) {
            this.handleError(error, response);
        }
    }

    

    async rename(request, response) {
        try {
            const { workspace_id, channel_id } = request.params;
            const { name } = request.body;
            
            if (!name) throw { status: 400, message: "El nombre es obligatorio" };

            const updatedChannel = await channelRepository.update(channel_id, workspace_id, name);
            
            response.json({
                status: 200,
                ok: true,
                message: 'Canal renombrado con éxito',
                data: { updatedChannel }
            });
        } catch (error) {
            this.handleError(error, response);
        }
    }

    async deleteChannel(request, response) {
        try {
            const { workspace_id, channel_id } = request.params;
            await channelRepository.delete(channel_id, workspace_id);
            
            response.json({
                status: 200,
                ok: true,
                message: 'Canal eliminado con éxito',
                data: null
            });
        } catch (error) {
            this.handleError(error, response);
        }
    }

    
    handleError(error, response) {
        console.log("Error en ChannelController", error);
        if (error.status) {
            return response.json({
                status: error.status,
                ok: false,
                message: error.message,
                data: null
            });
        }
        return response.json({
            ok: false,
            status: 500,
            message: "Error interno del servidor",
            data: null
        });
    }
}

const channelController = new ChannelController()
export { channelController }