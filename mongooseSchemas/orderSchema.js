import mongoose from "mongoose"

const orderSchema = new mongoose.Schema({
    username: {
        require: true,
        type: mongoose.Schema.Types.String
    },
    products: {
        require: true,
        type: mongoose.Schema.Types.Array
    },
    orderDate: {
        require: true,
        type: mongoose.Schema.Types.Date
    },
    amount: {
        require: true,
        type: mongoose.Schema.Types.Number
    },
    orderId: {
        require: true,
        type: mongoose.Schema.Types.String
    },
    status: {
        type: mongoose.Schema.Types.String
    }
})

export const Orders = mongoose.model("orders", orderSchema)