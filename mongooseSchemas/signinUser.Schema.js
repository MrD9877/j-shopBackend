import mongoose from "mongoose"

const user = new mongoose.Schema({
    username: {
        require: true,
        type: mongoose.Schema.Types.String,
        unique: true
    },
    email: {
        require: true,
        type: mongoose.Schema.Types.String
    },
    password: {
        require: true,
        type: mongoose.Schema.Types.String
    }
})

export const NewUser = mongoose.model("NewUser", user)