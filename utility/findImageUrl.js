import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import dotenv from 'dotenv'
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

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


async function getImagesUrls(image) {
    const getObjectParams = {
        Bucket: bucketName,
        Key: image,
    }
    const command = new GetObjectCommand(getObjectParams);
    const url = await getSignedUrl(s3, command, { expiresIn: 3600 * 24 * 7 });
    return url
}

export async function intigrateUrls(item, type) {
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

async function setUrls(images) {
    const urls = []
    for (let i = 0; i < images.length; i++) {
        const url = await getImagesUrls(images[i])
        urls.push(url)
    }
    return urls
}



export default setUrls
