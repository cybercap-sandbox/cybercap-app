import { api } from "@/utils/api";
import { useSession } from "next-auth/react";
import { type Dispatch, type SetStateAction, useEffect, useState } from "react";
import { type ImageWithStatus } from "@/components/openai-images-playground/image-gallery";
import type { PutBlobResult } from "@vercel/blob";

export function useImageGenerationRequest(
  setGeneratedImages: Dispatch<SetStateAction<ImageWithStatus[]>>
) {
  const [userRequestId, setUserRequestId] = useState<string | undefined>(
    undefined
  );
  const { data: session } = useSession();
  const saveUserRequestMutation =
    api.imageGenerationLog.saveUserRequest.useMutation();
  const saveGeneratedImagesMutation =
    api.imageGenerationLog.saveGeneratedImages.useMutation();

  const getGeneratedImagesQuery =
    api.imageGenerationLog.getImagesGeneratedByUser.useQuery(
      { numberOfImages: 9 },
      {
        refetchOnWindowFocus: false,
        enabled: !!session,
      }
    );

  useEffect(() => {
    if (!getGeneratedImagesQuery.data) return;
    const imageUrlList = getGeneratedImagesQuery.data.map(
      (image) => image.imageUrl
    );
    if (!imageUrlList) return;

    // set images urls in state
    const imagesWithStatus: ImageWithStatus[] = imageUrlList
      .filter((image) => !!image)
      .map((image) => ({
        url: image ?? "",
        loaded: false,
      }));
    setGeneratedImages(imagesWithStatus);
  }, [getGeneratedImagesQuery.data, setGeneratedImages]);

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

  const uploadImageToVercel = async (fileUrl: string) => {
    console.log("fileUrl", fileUrl);
    const response = await fetch(`/api/files/upload`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fileUrl }),
    });

    console.log("response", response);
    const newBlob = (await response.json()) as PutBlobResult;
    return newBlob.url;
  };

  const uploadImagesToStorageAndSaveInfoInDb = async (
    imageTempUrls: string[]
  ) => {
    if (!userRequestId) return;

    // upload images and save info
    for (const imageTempUrl of imageTempUrls) {
      const fileUrl = await uploadImageToVercel(imageTempUrl);
      await saveGeneratedImagesMutation.mutateAsync({
        userRequestId,
        imageUrl: fileUrl,
      });
    }
  };

  const isMutationLoading =
    saveGeneratedImagesMutation.isLoading || saveUserRequestMutation.isLoading;
  const initialLoadingGeneratedImages =
    getGeneratedImagesQuery.isInitialLoading;
  return {
    saveUserRequest,
    saveGeneratedImages: uploadImagesToStorageAndSaveInfoInDb,
    isMutationLoading,
    initialLoadingGeneratedImages,
  };
}
