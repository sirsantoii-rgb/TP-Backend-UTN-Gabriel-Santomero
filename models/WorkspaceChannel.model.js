import mongoose from "mongoose";

const WorkspaceChannelSchema = new mongoose.Schema(
    { 
        fk_id_workspace: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "WorkSpace",
                required: true
            },

            chanel_name:{
                type: String,
                required: true
            },

            created_at: {
                type: Date,
                default: Date.now
            },

    })   


    const WorkspaceChannel = mongoose.model ("WorkSpaceChannel", WorkspaceChannelSchema)
    
    export default WorkspaceChannel