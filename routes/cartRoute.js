import { Router } from "express";
import { Product } from "../mongooseSchemas/productSchema.js";
import setUrls from "../utility/findImageUrl.js";

const router = Router()

const findImages = async (products) => {
    const productsWithNewUrls = products
    for (let i = 0; i < products.length; i++) {
        const findProduct = await Product.findOne({ productId: products[i].productId })
        const imageURLS = await setUrls(findProduct.images)
        productsWithNewUrls[i].images = imageURLS
    }
    return productsWithNewUrls
}


async function changeImageUrl(cart) {
    const productWithImage = await findImages(cart.products)
    const cartNew = { ...cart, products: productWithImage }
    return cartNew
}

router.post("/cart", (req, res) => {
    req.session.cart = req.body
    res.sendStatus(201)
})

router.get("/cart", (req, res) => {
    req.sessionStore.get(req.sessionID, async (err, sessionData) => {
        if (err) {
            return res.send({ "msg": "please login to use this service" }).status(401)
        }
        const data = await sessionData
        if (!data) return res.sendStatus(502)
        if (!data.cart) return res.sendStatus(400)
        if (!data.cart.products) return res.sendStatus(400)
        const cart = data.cart
        const cartWithNewUrl = await changeImageUrl(cart)
        if (!cartWithNewUrl) return res.send(cart)
        res.send(cartWithNewUrl)
    })
})

export default router