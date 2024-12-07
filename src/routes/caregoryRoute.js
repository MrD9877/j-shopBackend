import { Router } from "express";
import { Product } from "../mongooseSchemas/productSchema.js";
import setUrls, { intigrateUrls } from "../utility/findImageUrl.js";

const router = Router()


const filter = (products) => {
    const categaries = []
    for (let i = 0; i < products.length; i++) {
        let match = false
        for (let j = 0; j < categaries.length; j++) {
            match = categaries[j].category === products[i].category ? true : false
        }
        if (!match) categaries.push(products[i])
    }
    return categaries
}

router.get("/category", async (req, res) => {
    const type = req.query.category
    if (type) {
        const products = await Product.find({ category: type })
        const getProductWithImageUrls = await intigrateUrls(products, "products")
        return res.send(getProductWithImageUrls)
    }
    const products = await Product.find()
    const categaries = filter(products)
    const category = await Promise.all(categaries.map(async (item) => {
        const imageUrl = await setUrls([item.images[0]])
        const cat = { category: item.category, image: imageUrl[0] }
        return cat
    }))
    res.send(category)

})


export default router