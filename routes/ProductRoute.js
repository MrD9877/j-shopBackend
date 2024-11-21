import { Router } from "express";
import isAuthenticated from "../utility/authentication.js";
import isAdmin from "../utility/adminAuth.js";
import { Product } from "../mongooseSchemas/productSchema.js";
import { checkSchema, matchedData, validationResult } from "express-validator";
import addProductSchema from "../expressValidation/addProduct.js";
import { Categories } from "../mongooseSchemas/categorySchema.js";
import multer from 'multer'
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import dotenv from 'dotenv'
import { generateRandom } from "../utility/randomKey.js";
import sharp from 'sharp'
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const router = Router()
dotenv.config()
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

const bucketName = process.env.BUCKET_NAME
const bucketRegion = process.env.BUCKET_REGION
const bucketAccess = process.env.BUCKET_ACCESS_KEY
const bucketSecret = process.env.BUCKET_SECRET_KEY

const s3 = new S3Client({
    credentials: {
        accessKeyId: bucketAccess,
        secretAccessKey: bucketSecret
    },
    region: bucketRegion
})

async function getImagesUrls(image) {
    const getObjectParams = {
        Bucket: bucketName,
        Key: image
    }
    const command = new GetObjectCommand(getObjectParams);
    const url = await getSignedUrl(s3, command, { expiresIn: 3600 * 8 });
    return url
}

router.post("/product", isAuthenticated, isAdmin, upload.any('image'), async (req, res) => {
    const files = req.files
    const images = []
    const productId = generateRandom(10)
    // uploading files to aws ... 
    try {
        files.forEach(async (file) => {
            const imageName = generateRandom(32)
            images.push(imageName)
            const params = {
                Bucket: bucketName,
                Key: imageName,
                Body: file.buffer,
                ContentType: file.mimetype
            }
            const commad = new PutObjectCommand(params)
            await s3.send(commad)
        })
    } catch {
        return res.sendStatus(502)
    }
    const data = {
        title: req.body.title,
        stock: req.body.stock,
        price: req.body.price,
        category: req.body.category,
        description: req.body.description,
    }
    console.log(req.body)
    const date = Date.now()
    try {
        const product = new Product({ ...data, "date": date, images: images, productId: productId })
        await product.save()
        res.sendStatus(201)
    } catch (err) {
        res.status(400).send(err.message)
    }
})

router.delete("/product", isAuthenticated, isAdmin, async (req, res) => {
    try {
        await Product.deleteOne({ productId: req.body.productId })
        res.sendStatus(204)
    } catch (err) {
        return res.status(502).send({ message: err.message })
    }
})

router.patch("/product", isAuthenticated, isAdmin, async (req, res) => {
    try {
        const patch = req.body.patch;
        const productId = req.body.productId;
        const content = req.body.content;
        const dbResponse = await Product.updateOne({ productId: productId },
            { $set: { [patch]: content } },
            { upsert: false, multi: false }
        )
        if (dbResponse.acknowledged) {
            return res.sendStatus(201)
        }
        res.sendStatus(400)
    } catch (err) {
        return res.status(400).send({ message: err.message })
    }
})

async function setUrls(images) {
    const urls = []
    for (let i = 0; i < images.length; i++) {
        const url = await getImagesUrls(images[i])
        urls.push(url)
    }
    return urls
}


async function intigrateUrls(item, type) {
    if (type === "products") {
        let returnItem = []
        for (let i = 0; i < item.length; i++) {
            const product = item[i]
            const urls = await setUrls([...product.images])
            product.images = [...urls]
            returnItem.push(product)
        }
        return returnItem
    } else if (type === "product") {
        const urls = await setUrls(item.images)
        const productWithurl = item
        productWithurl.images = [...urls]
        return productWithurl
    }
}

router.get("/product", async (req, res) => {
    const productId = req.query.productId
    const search = req.query.search
    if (productId) {
        try {
            const product = await Product.findOne({ productId: productId })
            if (!product) return res.status(400).send({ message: "no product with this id" })
            const productWithUrl = await intigrateUrls(product, "product")
            return res.send(productWithUrl)
        } catch (err) {
            return res.status(400).send({ message: err.message })
        }
    } else if (search) {
        const products = await Product.find({ $text: { $search: search } })
        const productsWithUrls = await intigrateUrls(products, "products")
        res.send(productsWithUrls)
    } else {
        const products = await Product.find()
        const productsWithUrls = await intigrateUrls(products, "products")
        res.send(productsWithUrls)
    }
})

router.post("/category", isAuthenticated, isAdmin, async (req, res) => {
    try {
        const categorie = new Categories(req.body)
        await categorie.save()
        res.sendStatus(201)
    } catch (err) {
        res.status(400).send({ message: err.message })
    }
})

router.get("/category", async (req, res) => {
    const category = req.query.category
    if (category) {
        try {
            const products = await Product.find({ category: category })
            return res.send(products)
        } catch (err) {
            return res.status(502).send({ message: err.message })
        }
    }
    try {
        const categories = await Categories.find()
        res.send(categories)
    } catch (err) {
        res.status(502).send({ message: err.message })
    }
})

export default router