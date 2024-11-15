import mongoose from "mongoose"

const categorieSchema = new mongoose.Schema({
    categorie: {
        require: true,
        type: mongoose.Schema.Types.String
    }
})

export const Categories = mongoose.model("Categories", categorieSchema)