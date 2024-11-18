import { Router } from "express"
import isAuthenticated from "../utility/authentication.js"
import { Orders } from "../mongooseSchemas/orderSchema.js"
import { Product } from "../mongooseSchemas/productSchema.js"

const router = Router()

const productsOrdered = []
const stock = { instock: true, product: null }

async function checkForStock(products, req, res) {
    try {
        for (let i = 0; i < products.length; i++) {
            if (stock.instock) {
                const product = await Product.findOne({ productId: products[i].productId })
                productsOrdered.push(product)
                stock.instock = product.stock >= products[i].count ? true : false
                stock.product = stock.instock ? null : products[i]
            }
        }
    } catch (err) {
        return res.status(502).send({ msg: "opp!Somting went wrong try again" })
    }
}

router.post("/order", isAuthenticated, async (req, res) => {
    const products = req.body
    const username = res.user.username
    if (!products || !products.length) return res.status(400).send({ msg: "wrong request" })
    // check if product in stock 
    await checkForStock(products, req, res)
    console.log(productsOrdered)
    if (!stock.instock) return res.status(400).send({ msg: `${stock.product.title} is not in stock please remove this item` })
    //sutract stock

    if (stock.instock) {
        try {
            for (let i = 0; i < products.length; i++) {
                console.log(productsOrdered)
                console.log(i)
                const productStock = productsOrdered[i].stock - products[i].count
                const product = await Product.updateOne({ productId: products[i].productId },
                    { $set: { stock: productStock } }
                )
                if (!product.acknowledged) return res.status(502).send({ msg: "opp!Somting went wrong try again" })
            }
        } catch (err) {
            return res.status(502).send({ msg: "opp!Somting went wrong try again" })
        }
    }
    const date = Date.now()
    // order 
    const order = new Orders({ username: username, products: products, orderDate: date })
    await order.save()
    res.sendStatus(200)

})

router.get("/order", isAuthenticated, async (req, res) => {
    const username = res.user.username;
    try {
        const orders = await Orders.find({ username: username })
        res.status(200).send(orders)
    } catch (err) {
        res.status(502).send({ msg: "opp!Somting went wrong try again" })
    }
})

export default router