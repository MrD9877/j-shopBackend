import mongoose from "mongoose"

const categorySchema = new mongoose.Schema({
    title: {
        unique: true,
        require: true,
        type: mongoose.Schema.Types.String
    },
    image: {
        type: mongoose.Schema.Types.String
    },
})

export const Categories = mongoose.model("Categories", categorySchema)