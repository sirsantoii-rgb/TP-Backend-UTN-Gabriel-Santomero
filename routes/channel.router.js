import express from "express";
import { channelController } from "../controllers/channel.controller.js";
import authMiddleware from "../middlewares/auth.middlware.js";
import workspaceMiddleware from "../middlewares/workspace.middleware.js";

const channelRouter = express.Router();

// Obtener todos los canales del workspace
channelRouter.get(
    '/:workspace_id', 
    authMiddleware, 
    workspaceMiddleware(), 
    channelController.getAllByWorkspaceId
);

// Crear canal (Solo Owner/Admin)
channelRouter.post(
    '/:workspace_id', 
    authMiddleware, 
    workspaceMiddleware(['Owner', 'Admin']), 
    channelController.create
);

// Renombrar canal (Solo Owner/Admin)
channelRouter.put(
    '/:workspace_id/:channel_id', 
    authMiddleware, 
    workspaceMiddleware(['Owner', 'Admin']), 
    channelController.rename
);

// Eliminar canal (Solo Owner/Admin)
channelRouter.delete(
    '/:workspace_id/:channel_id', 
    authMiddleware, 
    workspaceMiddleware(['Owner', 'Admin']), 
    channelController.deleteChannel
);

export default channelRouter;