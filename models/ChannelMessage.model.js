import mongoose from "mongoose";

const ChannelMessageSchema = new mongoose.Schema(
    {   
        fk_id_ws_channel: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "WorkSpaceChannel",
                    required: true
                },
        fk_id_ws_member: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Member",
                    required: true
                },
        message: {
            type: String,
            required: true
        },
        created_at: {
            type: Date,
            default: Date.now
        },        
    })

    const Channel_message = mongoose.model ("ChannelMessage", ChannelMessageSchema)
    
    export default Channel_message