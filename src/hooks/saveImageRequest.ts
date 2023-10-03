import { api } from "@/utils/api";
import { saveImageInBucket } from "@/utils/minio/file-uploader";
import { useSession } from "next-auth/react";
import { env } from "@/env.mjs";
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

  const getGeneratedImagesQuery =
    api.imageGenerationLog.getAllImagesGeneratedByUser.useQuery(
      { numberOfImages: 10 },
      {
        enabled: !!session,
      }
    );

  //   useEffect(() => {
  //     if (!getGeneratedImagesQuery.data) return;
  //     const requests = getGeneratedImagesQuery.data?.map(
  //       (d) => d.generatedImages
  //     );
  //     if (!requests) return;
  //     const images = requests.flat().map((d) => d.imageUrl);
  //     setGeneratedImages(images);
  //   }, [getGeneratedImagesQuery.data, setGeneratedImages]);

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

  const uploadImagesToBucketAndSaveInfoInDb = async (images: string[]) => {
    if (userRequestId) {
      await saveGeneratedImagesMutation.mutateAsync({
        imageGenerationRequestId: userRequestId,
        generatedImages: images,
      });
    }
  };

  const isQueryLoading = session && getGeneratedImagesQuery.isLoading;
  const isMutationLoading =
    saveGeneratedImagesMutation.isLoading || saveUserRequestMutation.isLoading;
  return {
    saveUserRequest,
    saveGeneratedImages: uploadImagesToBucketAndSaveInfoInDb,
    isQueryLoading,
    isMutationLoading,
  };
}
