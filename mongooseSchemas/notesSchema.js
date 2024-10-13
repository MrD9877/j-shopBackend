import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
    username: {
        type: mongoose.Schema.Types.String,
        require: true,
        unique: true,
    },
    notes: {
        type: mongoose.Schema.Types.Array,
        require: true,
    },
})
// const noteSchema = new mongoose.Schema({
//     username: {
//         type: mongoose.Schema.Types.String,
//         require: true,
//         unique: true,
//     },
//     topic: {
//         type: mongoose.Schema.Types.String,
//         require: true,
//     },
//     content: {
//         type: mongoose.Schema.Types.String,
//         require: true,
//     }
// })


export const Note = mongoose.model("Note", noteSchema)