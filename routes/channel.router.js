import express from "express";
import { channelController } from "../controllers/channel.controller.js";
import authMiddleware from "../middlewares/auth.middlware.js";
import workspaceMiddleware from "../middlewares/workspace.middleware.js";

const channelRouter = express.Router();

// Nota: Como los canales dependen de un Workspace, 
// usualmente pasamos el workspace_id en la ruta
channelRouter.post(
    '/:workspace_id', 
    authMiddleware, 
    workspaceMiddleware(['Owner', 'Admin']), // Solo jefes crean canales
    channelController.create
);

channelRouter.get(
    '/:workspace_id', 
    authMiddleware, 
    workspaceMiddleware(), 
    channelController.getAllByWorkspaceId
);

export default channelRouter;