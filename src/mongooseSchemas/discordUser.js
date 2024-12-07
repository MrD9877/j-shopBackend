import mongoose from "mongoose"

const userDiscord = new mongoose.Schema({
    username: {
        require: true,
        type: mongoose.Schema.Types.String
    },
    email: {
        require: true,
        type: mongoose.Schema.Types.String
    },
    discordID: {
        require: true,
        type: mongoose.Schema.Types.String
    }
})

export const UserDiscord = mongoose.model("UserDiscord", userDiscord)