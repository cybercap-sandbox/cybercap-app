import { api } from "@/utils/api";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { nanoid } from "ai";

export function useSaveImageRequest() {
  const [userRequestId, setUserRequestId] = useState<string | undefined>(
    undefined
  );
  const { data: session } = useSession();
  const saveUserRequestMutation =
    api.imageGenerationLog.saveUserRequest.useMutation();
  const saveGeneratedImagesMutation =
    api.imageGenerationLog.saveGeneratedImages.useMutation();

  const saveGeneratedImageInBucketMutation =
    api.imageGenerationLog.saveGeneratedImageIntoBucket.useMutation();
  const imageFormat = "jpg";

  // const getImageFromBucketQuery =
  //   api.imageGenerationLog.getGeneratedImageFromBucket.useMutation();

  // const getGeneratedImagesQuery =
  //   api.imageGenerationLog.getAllImagesGeneratedByUser.useQuery(
  //     { numberOfImages: 10 },
  //     {
  //       enabled: !!session,
  //     }
  //   );

  // useEffect(() => {
  //   if (!getGeneratedImagesQuery.data) return;
  //   const requests = getGeneratedImagesQuery.data?.map(
  //     (d) => d.generatedImages
  //   );
  //   if (!requests) return;
  //   const images = requests.flat().map((d) => d.imageUrl);
  //   setGeneratedImages(images);
  // }, [getGeneratedImagesQuery.data, setGeneratedImages]);

  // useEffect(() => {
  //   getGeneratedImgFromBucket("12345-fRF9pcz").then((img) => {
  //     setGeneratedImages((prev) => [...prev, img]);
  //   });
  // }, []);

  const saveUserRequest = async ({
    value,
  }: {
    value: { prompt: string; size: string; n: number };
  }) => {
    const userRequest = await saveUserRequestMutation.mutateAsync({
      requestText: value.prompt,
      imageSize: value.size,
      numberOfImages: value.n,
    });
    setUserRequestId(userRequest.id);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const saveGeneratedImageInBucket = async (fileUrl: string) => {
    const fileName = `${session?.user.id}-${nanoid()}.jpg`;

    await saveGeneratedImageInBucketMutation.mutateAsync({
      fileUrl,
      fileName,
    });
  };

  // const getGeneratedImgFromBucket = async (imageName: string) => {
  //   const image = await getImageFromBucketMutation.mutateAsync({
  //     imageName,
  //   });
  //   return image;
  // };
  const uploadImagesToBucketAndSaveInfoInDb = async (imageUrls: string[]) => {
    console.log("imageUrls", imageUrls);
    if (!userRequestId) return;
    console.log("userRequestId", userRequestId);
    // generate image names
    const imagesInfo = imageUrls.map((imageUrl) => {
      const fileName = `${session?.user.id}-${nanoid()}.${imageFormat}`;
      return {
        fileUrl: imageUrl,
        fileName,
      };
    });

    // upload images to bucket
    for (const image of imagesInfo) {
      await saveGeneratedImageInBucketMutation.mutateAsync({
        fileUrl: image.fileUrl,
        fileName: image.fileName,
      });
    }

    // save image info in db
    const imageNames = imagesInfo.map((info) => info.fileName);
    await saveGeneratedImagesMutation.mutateAsync({
      userRequestId,
      imageNames,
    });
  };

  // const isQueryLoading = session && getGeneratedImagesQuery.isLoading;
  const isMutationLoading =
    saveGeneratedImagesMutation.isLoading || saveUserRequestMutation.isLoading;
  return {
    saveUserRequest,
    saveGeneratedImages: uploadImagesToBucketAndSaveInfoInDb,
    // getGeneratedImgFromBucket,
    // isQueryLoading,
    isMutationLoading,
  };
}
