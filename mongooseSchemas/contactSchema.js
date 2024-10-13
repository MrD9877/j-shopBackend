import mongoose from "mongoose"

const contactSchema = new mongoose.Schema({
    userEmail: {
        require: true,
        type: mongoose.Schema.Types.String
    },
    userQuery: {
        require: true,
        type: mongoose.Schema.Types.String
    }
})

export const Contact = mongoose.model("Contact", contactSchema)