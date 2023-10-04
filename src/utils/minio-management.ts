import * as Minio from "minio";
import axios from "axios";
import { env } from "@/env.mjs";
import * as http from "http";

const minioClient = new Minio.Client({
  endPoint: env.MINIO_ENDPOINT,
  port: env.MINIO_PORT ?? 9000,
  accessKey: env.MINIO_ACCESS_KEY,
  secretKey: env.MINIO_SECRET_KEY,
  useSSL: env.MINIO_USE_SSL ?? false,
});

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
  // console.log(response.data);
  console.log("endPoint", env.MINIO_ENDPOINT);
  console.log("port", env.MINIO_PORT);
  console.log("accessKey", env.MINIO_ACCESS_KEY);
  console.log("secretKey", env.MINIO_SECRET_KEY);
  console.log("useSSL", env.MINIO_USE_SSL);
  console.log("bucketName", bucketName);
  console.log("fileName", fileName);

  // // Upload image to MinIO
  await minioClient.putObject(bucketName, fileName, response.data);

  // Download image from URL
  // const url = new URL(fileUrl);
  // const options = {
  //   hostname: url.hostname,
  //   port: url.port,
  //   path: url.pathname,
  //   headers: {
  //     "User-Agent": "Mozilla/5.0",
  //   },
  // };
  // const request = http.get(options, (response) => {
  //   const chunks: Buffer[] = [];
  //   response.on("data", (chunk) => {
  //     chunks.push(chunk);
  //   });
  //   response.on("end", () => {
  //     const buffer = Buffer.concat(chunks);
  //     // Upload image to MinIO
  //     void minioClient.putObject(bucketName, fileName, buffer);
  //   });
  // });
  // request.end();
}

export function getFileFromBucket({
  bucketName,
  fileName,
}: {
  bucketName: string;
  fileName: string;
}) {
  return new Promise<string>((resolve, reject) => {
    minioClient.getObject(bucketName, fileName, (err, dataStream) => {
      if (err) {
        reject(err);
      }
      const chunks: any[] = [];
      dataStream?.on("data", (chunk) => {
        chunks.push(chunk);
      });
      dataStream?.on("end", () => {
        const image = Buffer.concat(chunks);
        resolve(image.toString("base64"));
      });
      dataStream?.on("error", (err) => {
        reject(err);
      });
    });
  });
}
