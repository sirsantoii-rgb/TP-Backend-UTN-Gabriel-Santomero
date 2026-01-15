import mongoose from "mongoose";

const workspaceSchema = new mongoose.Schema(
    {
        fk_id_owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        titlle: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: false,
        },
        imagen: {
            type: String,
            required: false
        },
        created_at: {
            type: Date,
            default: Date.now
        },
        active: {
            type: Boolean,
            default: true
        }
    }
)

const WorkSpace = mongoose.model ("WorkSpace", workspaceSchema)

export default WorkSpace