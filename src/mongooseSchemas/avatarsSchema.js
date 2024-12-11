import mongoose from "mongoose"

const avatarSchema = new mongoose.Schema({
    avatar: {
        require: true,
        type: mongoose.Schema.Types.String
    },
    id: {
        require: true,
        type: mongoose.Schema.Types.Number
    },
    imageUrl: {
        url: {
            type: mongoose.Schema.Types.String
        },
        generated: {
            type: mongoose.Schema.Types.Date
        }
    }
})

export const Avatar = mongoose.model("Avatar", avatarSchema)