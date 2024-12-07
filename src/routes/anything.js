import { Router } from "express";
import multer from 'multer'
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import dotenv from 'dotenv'
import { generateRandom } from "../utility/randomKey.js";
import sharp from 'sharp'
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

const router = Router()
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

router.get('/uploadtest', async (req, res) => {
    const getObjectParams = {
        Bucket: bucketName,
        Key: 'd89535c7ab1ea33ca59a644e42a278b3f9f0778b90536e266a8c0eeae86d8585'
    }
    const command = new GetObjectCommand(getObjectParams);
    const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
    res.send(url)
})
router.post('/upload', upload.any('image'), async (req, res) => {
    const data = req.body.data
    const files = req.files
    const images = []
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
    res.sendStatus(200)
})

router.post('/uploadtest', upload.single('image'), async (req, res) => {
    console.log(req.file)
    // const image = await sharp(req.file.buffer).resize({height:1920,width:1080,fit:'contain'}).toBuffer()
    const imageName = generateRandom(32)
    const params = {
        Bucket: bucketName,
        Key: imageName,
        Body: req.file.buffer,
        ContentType: req.file.mimetype
    }
    try {
        const commad = new PutObjectCommand(params)
        await s3.send(commad)
    } catch {
        return res.sendStatus(502)
    }
    res.sendStatus(200)

})

export default router