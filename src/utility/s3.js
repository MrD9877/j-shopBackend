import { S3Client } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
dotenv.config();
const bucketRegion = process.env.BUCKET_REGION;
const bucketAccess = process.env.BUCKET_ACCESS_KEY;
const bucketSecret = process.env.BUCKET_SECRET_KEY;
export const s3 = new S3Client({
  credentials: {
    accessKeyId: bucketAccess,
    secretAccessKey: bucketSecret,
  },
  region: bucketRegion,
});
