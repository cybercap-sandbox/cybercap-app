import * as Minio from "minio";

const minioClient = new Minio.Client({
  endPoint: "play.min.io",
  port: 9000,
  useSSL: true,
  accessKey: "Q3AM3UQ867SPQQA43P2F",
  secretKey: "zuf+tfteSlswRu7BJ86wekitnifILbZam1KYY3TG",
});

export function saveImageInBucket({
  image,
  bucketName,
  fileName,
}: {
  image: string;
  bucketName: string;
  fileName: string;
}) {
  return new Promise<string>((resolve, reject) => {
    minioClient.putObject(
      bucketName,
      fileName,
      Buffer.from(image, "base64"),
      (err) => {
        if (err) {
          reject(err);
        }
        resolve(etag);
      }
    );
  });
}
