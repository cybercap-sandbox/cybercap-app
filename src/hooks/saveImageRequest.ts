import { api } from "@/utils/api";
import { useSession } from "next-auth/react";
import { type Dispatch, type SetStateAction, useEffect, useState } from "react";
import { nanoid } from "ai";
import { type ImageWithStatus } from "@/components/openai-playground/image-gallery";

export function useSaveImageRequest(
  setGeneratedImages: Dispatch<SetStateAction<ImageWithStatus[]>>
) {
  const [userRequestId, setUserRequestId] = useState<string | undefined>(
    undefined
  );
  const imageFormat = "jpg";
  const { data: session } = useSession();
  const saveUserRequestMutation =
    api.imageGenerationLog.saveUserRequest.useMutation();
  const saveGeneratedImagesMutation =
    api.imageGenerationLog.saveGeneratedImages.useMutation();

  const saveGeneratedImageInBucketMutation =
    api.imageGenerationLog.saveGeneratedImageIntoBucket.useMutation();

  const getImageUrlFromBucket =
    api.imageGenerationLog.getGeneratedImageFromBucket.useMutation();

  const getGeneratedImagesQuery =
    api.imageGenerationLog.getImagesGeneratedByUser.useQuery(
      { numberOfImages: 9 },
      {
        enabled: !!session,
      }
    );

  useEffect(() => {
    if (!getGeneratedImagesQuery.data) return;
    const imageNamesList = getGeneratedImagesQuery.data.map(
      (image) => image.imageName
    );
    if (!imageNamesList) return;

    // get image urls from bucket
    const fetchImages = async () => {
      const imagesFromBucket = await Promise.all(
        imageNamesList.map((image) => {
          return getImageUrlFromBucket.mutateAsync({
            fileName: image,
          });
        })
      );
      // set images urls in state
      const imagesWithStatus: ImageWithStatus[] = imagesFromBucket
        .filter((image) => !!image)
        .map((image) => ({
          url: image ?? "",
          loaded: false,
        }));
      setGeneratedImages(imagesWithStatus);
    };
    void fetchImages();

    // getImageUrlFromBucket is not a dependency because it is a mutation
    // if we add it as a dependency, it will cause an infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getGeneratedImagesQuery.data, setGeneratedImages]);

  // const handleLoadMoreImages = async (numOfImages: number) => {

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

  const getGeneratedImgFromBucket = async (imageName: string) => {
    const image = await getImageUrlFromBucket.mutateAsync({
      fileName: imageName,
    });
    return image;
  };

  const uploadImagesToBucketAndSaveInfoInDb = async (imageUrls: string[]) => {
    if (!userRequestId) return;
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

  const isMutationLoading =
    saveGeneratedImagesMutation.isLoading || saveUserRequestMutation.isLoading;

  return {
    saveUserRequest,
    saveGeneratedImages: uploadImagesToBucketAndSaveInfoInDb,
    getGeneratedImgFromBucket,
    isMutationLoading,
  };
}
