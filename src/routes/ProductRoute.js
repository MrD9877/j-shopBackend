import { Router } from "express";
import isAuthenticated from "../utility/authentication.js";
import isAdmin from "../utility/adminAuth.js";
import { Product } from "../mongooseSchemas/productSchema.js";
import multer from "multer";
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
import { generateRandom } from "../utility/randomKey.js";

const router = Router();
dotenv.config();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const bucketName = process.env.BUCKET_NAME;
const bucketRegion = process.env.BUCKET_REGION;
const bucketAccess = process.env.BUCKET_ACCESS_KEY;
const bucketSecret = process.env.BUCKET_SECRET_KEY;

const s3 = new S3Client({
  credentials: {
    accessKeyId: bucketAccess,
    secretAccessKey: bucketSecret,
  },
  region: bucketRegion,
});

router.post("/product", isAuthenticated, isAdmin, upload.any("image"), async (req, res) => {
  const files = req.files;
  const images = [];
  const productId = generateRandom(10);
  // uploading files to aws ...
  try {
    files.forEach(async (file) => {
      const imageName = generateRandom(32);
      images.push(imageName);
      const params = {
        Bucket: bucketName,
        Key: imageName,
        Body: file.buffer,
        ContentType: file.mimetype,
      };
      const commad = new PutObjectCommand(params);
      await s3.send(commad);
    });
  } catch {
    return res.sendStatus(502);
  }
  const data = {
    title: req.body.title,
    colors: req.body.colors.split(","),
    size: req.body.size.split(","),
    stock: req.body.stock,
    price: req.body.price,
    category: req.body.category,
    description: req.body.description,
  };
  const date = Date.now();
  try {
    const product = new Product({ ...data, date, images, productId });
    await product.save();
    res.sendStatus(201);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

router.delete("/product", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const product = await Product.findOne({ productId: req.body.productId });
    const images = product.images;
    images.forEach(async (image) => {
      const params = {
        Bucket: bucketName,
        Key: image,
      };
      const command = new DeleteObjectCommand(params);
      const response = await s3.send(command);
      console.log(response);
    });
  } catch (err) {
    return res.status(502).send({ message: err.message });
  }
  try {
    await Product.deleteOne({ productId: req.body.productId });
    res.sendStatus(200);
  } catch (err) {
    return res.status(502).send({ message: err.message });
  }
});

router.patch("/product", isAuthenticated, isAdmin, async (req, res) => {
  const patch = req.body.patch;
  const productId = req.body.productId;
  const content = req.body.content;
  if (patch == null || productId == null || content == null) return res.status(400).send({ message: "Invalid field" });
  try {
    const dbResponse = await Product.updateOne({ productId: productId }, { $set: { [patch]: content } }, { upsert: false, multi: false });
    if (dbResponse.acknowledged) {
      return res.sendStatus(201);
    }
    res.sendStatus(400);
  } catch (err) {
    return res.status(400).send({ message: err.message });
  }
});

router.get("/product", async (req, res) => {
  const productId = req.query.productId;
  const search = req.query.search;
  const category = req.query.category;
  if (productId) {
    try {
      const product = await Product.findOne({ productId: productId });
      if (!product) return res.status(400).send({ message: "no product with this id" });
      return res.status(200).send(product);
    } catch (err) {
      return res.status(400).send({ message: err.message });
    }
  } else if (search) {
    try {
      const products = await Product.find({ $text: { $search: search } });
      res.status(200).send(products);
    } catch (err) {
      return res.status(200).status(400).send({ message: err.message });
    }
  } else if (category) {
    try {
      const products = await Product.find({ category: category });
      res.status(200).send(products);
    } catch (err) {
      return res.status(200).status(400).send({ message: err.message });
    }
  } else {
    try {
      const products = await Product.find();
      res.status(200).send(products);
    } catch (err) {
      return res.status(400).send({ message: err.message });
    }
  }
});
export default router;
