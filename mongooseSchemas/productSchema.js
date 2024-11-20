import mongoose from "mongoose"

const product = new mongoose.Schema({
    productId: {
        require: true,
        type: mongoose.Schema.Types.String,
        unique: true
    },
    title: {
        require: true,
        type: mongoose.Schema.Types.String
    },
    description: {
        require: true,
        type: mongoose.Schema.Types.String
    },
    price: {
        require: true,
        type: mongoose.Schema.Types.Number
    },
    images: {
        type: mongoose.Schema.Types.Array
    },
    stock: {
        type: mongoose.Schema.Types.Number
    },
    colors: {
        type: mongoose.Schema.Types.Array
    },
    category: {
        type: mongoose.Schema.Types.String
    },
    date: {
        type: mongoose.Schema.Types.Date
    }
})
product.index({ title: "text", description: "text", category: "text", price: "text" })

export const Product = mongoose.model("Product", product)