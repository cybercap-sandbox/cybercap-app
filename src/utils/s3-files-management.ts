import * as Minio from "minio";
import axios from "axios";
import { env } from "@/env.mjs";

const s3Client = new Minio.Client({
  endPoint: env.S3_ENDPOINT,
  port: env.S3_PORT ? Number(env.S3_PORT) : undefined,
  accessKey: env.S3_ACCESS_KEY,
  secretKey: env.S3_SECRET_KEY,
  useSSL: env.S3_USE_SSL,
});

export async function createBucketIfNotExists(bucketName: string) {
  const bucketExists = await s3Client.bucketExists(bucketName);
  if (!bucketExists) {
    await s3Client.makeBucket(bucketName);
  }
}

export async function saveFileInBucket({
  fileUrl,
  bucketName,
  fileName,
}: {
  fileUrl: string;
  bucketName: string;
  fileName: string;
}) {
  // Download image from URL
  const response = await axios.get(fileUrl, {
    responseType: "arraybuffer",
  });

  // Create bucket if it doesn't exist
  await createBucketIfNotExists(env.S3_BUCKET_NAME);

  // Upload image to S3 bucket
  await s3Client.putObject(bucketName, fileName, response.data as Buffer);
}

export async function getFileFromBucket({
  bucketName,
  fileName,
}: {
  bucketName: string;
  fileName: string;
}) {
  try {
    await s3Client.statObject(bucketName, fileName);
  } catch (error) {
    console.error(error);
    return null;
  }
  return await s3Client.getObject(bucketName, fileName);
}

export async function getPresignedUrlForFile({
  bucketName,
  fileName,
}: {
  bucketName: string;
  fileName: string;
}) {
  // check if the file exists
  try {
    await s3Client.statObject(bucketName, fileName);
  } catch (error) {
    console.error(error);
    return null;
  }

  return await s3Client.presignedGetObject(bucketName, fileName);
}
