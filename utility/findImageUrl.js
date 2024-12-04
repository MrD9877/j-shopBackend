import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import dotenv from 'dotenv'
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { Product } from "../mongooseSchemas/productSchema.js";
import { checkDate } from "./checkGeneratedDifference.js";



dotenv.config()

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

async function saveProduct(product) {
    const changedProduct = await Product.updateOne({ productId: product.productId }, {
        $set: { imagesUrl: product.imagesUrl }
    })
}



async function getImagesUrls(image) {
    const getObjectParams = {
        Bucket: bucketName,
        Key: image,
    }
    const command = new GetObjectCommand(getObjectParams);
    const url = await getSignedUrl(s3, command, { expiresIn: 3600 * 24 * 7 });
    return url
}

async function setUrls(images) {
    const urls = []
    for (let i = 0; i < images.length; i++) {
        const url = await getImagesUrls(images[i])
        urls.push(url)
    }
    return urls
}

export async function intigrateUrls(item, type) {
    const timeNow = Date.now()
    if (type === "products") {
        let returnItem = []
        for (let i = 0; i < item.length; i++) {
            const product = item[i]
            const timeUrlLastGenerated = checkDate(product)
            if (timeUrlLastGenerated > 6) {
                const urls = await setUrls([...product.images])
                product.imagesUrl.urls = [...urls]
                product.imagesUrl.generated = timeNow
                await saveProduct(product)
                returnItem.push(product)
            } else {
                returnItem.push(product)
            }
        }
        return returnItem
    } else if (type === "product") {
        const product = item
        const timeUrlLastGenerated = checkDate(product)
        if (timeUrlLastGenerated > 6) {
            const urls = await setUrls(product.images)
            product.imagesUrl.urls = [...urls]
            product.imagesUrl.generated = timeNow
        }
        await saveProduct(product)
        return product
    }
}

export default setUrls
