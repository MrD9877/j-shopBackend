import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Product } from "../mongooseSchemas/productSchema.js";
import { generateRandom } from "../utility/randomKey.js";
import setUrls from "../utility/findImageUrl.js";
import dotenv from "dotenv";
import intigrateUrls from "../mockUtility/integrate.js";
dotenv.config();
const bucketRegion = process.env.BUCKET_REGION;
const bucketAccess = process.env.BUCKET_ACCESS_KEY;
const bucketSecret = process.env.BUCKET_SECRET_KEY;
const bucketName = process.env.BUCKET_NAME;

const s3 = new S3Client({
  credentials: {
    accessKeyId: bucketAccess,
    secretAccessKey: bucketSecret,
  },
  region: bucketRegion,
});

export const uploadProductHandler = async (req, res) => {
  const files = req.files;
  const images = [];
  const productId = generateRandom(10);
  // uploading files to aws ...
  files.forEach(async (file) => {
    const imageName = generateRandom(32);
    images.push(imageName);
    const params = {
      Bucket: bucketName,
      Key: imageName,
      Body: file.buffer,
      ContentType: file.mimetype,
    };
    try {
      const commad = new PutObjectCommand(params);
      await s3.send(commad);
    } catch {
      return res.sendStatus(502);
    }
  });
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
  const urls = await setUrls(images);
  try {
    const product = new Product({ ...data, date: date, images: images, productId: productId, imagesUrl: { urls: urls, generated: date } });
    await product.save();
    res.sendStatus(201);
  } catch (err) {
    res.status(400).send(err.message);
  }
};

export const testfnc = () => {
  return "test";
};

export const deleteProductHandler = async (req, res) => {
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
};

export const patchProductHandler = async (req, res) => {
  const patch = req.body.patch;
  const productId = req.body.productId;
  const content = req.body.content;
  if (!patch || !productId || !content) return res.status(400).send({ message: "Invalid field" });
  try {
    const dbResponse = await Product.updateOne({ productId: productId }, { $set: { [patch]: content } }, { upsert: false, multi: false });
    if (dbResponse.acknowledged) {
      return res.sendStatus(201);
    }
    res.sendStatus(400);
  } catch (err) {
    return res.status(400).send({ message: err.message });
  }
};

export const getProductHandler = async (req, res) => {
  const productId = req.query.productId;
  const search = req.query.search;
  if (productId) {
    try {
      const product = await Product.findOne({ productId: productId });
      if (!product) return res.status(400).send({ message: "no product with this id" });
      const productWithUrl = await intigrateUrls(product, "product");
      return res.send(productWithUrl);
    } catch (err) {
      return res.status(400).send({ message: err.message });
    }
  } else if (search) {
    const products = await Product.find({ $text: { $search: search } });
    const productsWithUrls = await intigrateUrls(products, "products");
    res.send(productsWithUrls);
  } else {
    const products = await Product.find();
    const productsWithUrls = await intigrateUrls(products, "products");
    res.send(productsWithUrls);
  }
};
