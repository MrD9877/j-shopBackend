import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
    username: {
        require: true,
        type: mongoose.Schema.Types.String,
        unique: false,
    },
    topic: {
        require: true,
        type: mongoose.Schema.Types.String,
    },
    content: {
        require: true,
        type: mongoose.Schema.Types.String
    }
})



export const Notes = mongoose.model("Notes", noteSchema)