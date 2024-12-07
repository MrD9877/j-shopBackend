import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import dotenv from 'dotenv'
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

async function uploadImage(imageName, file) {
    console.log("hi")
    const params = {
        Bucket: bucketName,
        Key: imageName,
        Body: file.buffer,
        ContentType: file.mimetype
    }
    const commad = new PutObjectCommand(params)
    const res = await s3.send(commad)
}
export default uploadImage