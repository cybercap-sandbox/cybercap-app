import * as Minio from "minio";
import axios from "axios";
import { env } from "@/env.mjs";

const minioClient = new Minio.Client({
  endPoint: env.MINIO_ENDPOINT,
  port: env.MINIO_PORT ?? 9000,
  accessKey: env.MINIO_ACCESS_KEY,
  secretKey: env.MINIO_SECRET_KEY,
  useSSL: env.MINIO_USE_SSL ?? false,
});

// check if bucket exists and create it if not
void (async () => {
  await createBucketIfNotExists(env.MINIO_BUCKET_NAME);
})();

export async function createBucketIfNotExists(bucketName: string) {
  const bucketExists = await minioClient.bucketExists(bucketName);
  if (!bucketExists) {
    await minioClient.makeBucket(bucketName);
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

  // Upload image to MinIO
  await minioClient.putObject(bucketName, fileName, response.data as Buffer);
}

export async function getFileFromBucket({
  bucketName,
  fileName,
}: {
  bucketName: string;
  fileName: string;
}) {
  console.log(minioClient);

  return await minioClient.getObject(bucketName, fileName);
}

export async function getPresignedUrlForFile({
  bucketName,
  fileName,
}: {
  bucketName: string;
  fileName: string;
}) {
  const url = await minioClient.presignedGetObject(bucketName, fileName);
  return url;
}
