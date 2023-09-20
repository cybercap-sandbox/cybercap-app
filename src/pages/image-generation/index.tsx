import Head from "next/head";
import { ImageGenerationPromptForm } from "@/components/openai-playground/image-promp-form";
import { Layout } from "@/components/layout";
import { api } from "@/utils/api";
import { useEffect, useState } from "react";
import type * as z from "zod";
import { type imgGenFormSchema } from "@/components/openai-playground/image-promp-form";
import { ImgGallery } from "@/components/openai-playground/image-gallery";
import { useSession } from "next-auth/react";
import { Icons } from "@/components/icons";

export type GenerateImageParams = {
  prompt: string;
  numberOfImages: number;
  size: "256x256" | "512x512" | "1024x1024";
};
export default function Home() {
  const { data: session } = useSession();
  const [imgGenStatus, setImgGenStatus] = useState<
    "idle" | "pending" | "fulfilled" | "rejected"
  >("idle");
  const [generatedImages, setGeneratedImages] = useState<
    (string | undefined)[]
  >([]);
  const [userRequestId, setUserRequestId] = useState<string | undefined>(
    undefined
  );

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

  useEffect(() => {
    if (!getGeneratedImagesQuery.data) return;
    const requests = getGeneratedImagesQuery.data?.map(
      (d) => d.generatedImages
    );
    if (!requests) return;
    const images = requests.flat().map((d) => d.imageUrl);
    setGeneratedImages(images);
  }, [getGeneratedImagesQuery.data]);

  const generateImageMutation = api.openai.generateImage.useMutation({
    onMutate: () => {
      // console.log("pending");
      setImgGenStatus("pending");
    },
    onError: () => {
      // console.log(error);
      setImgGenStatus("rejected");
    },
    onSuccess: (data) => {
      // console.log("success");
      if (!data.response) return;
      setImgGenStatus("fulfilled");
      const imgUrls = data.response?.map((d) => d.url!);
      if (!imgUrls) return;
      setGeneratedImages((prev) => [...imgUrls, ...prev]);
      // save generated images urls to db
      if (userRequestId) {
        saveGeneratedImagesMutation.mutate({
          imageGenerationRequestId: userRequestId,
          generatedImages: imgUrls,
        });
      }
    },
  });

  const generateImg = ({
    prompt,
    numberOfImages,
    size,
  }: GenerateImageParams) => {
    if (imgGenStatus === "pending") return;
    generateImageMutation.mutate({
      prompt,
      numberOfImages,
      size,
    });
  };
  const submitHandler = async (values: z.infer<typeof imgGenFormSchema>) => {
    //save user request and get id
    const userRequest = await saveUserRequestMutation.mutateAsync({
      requestText: values.prompt,
      imageSize: values.size,
      numberOfImages: values.n,
    });
    setUserRequestId(userRequest.id);
    generateImg({
      prompt: values.prompt,
      numberOfImages: values.n,
      size: values.size,
    });
  };
  const isLoading =
    imgGenStatus === "pending" ||
    (session && getGeneratedImagesQuery.isLoading);
  return (
    <>
      <Head>
        <title>Cybercap | Image generation</title>
        <meta name="description" content="Cybercap " />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <main className="bg-new-red container flex items-center justify-center ">
          <div className="mt-16 grid w-full grid-cols-1 gap-8 md:grid-cols-[300px_1fr]">
            <ImageGenerationPromptForm
              // eslint-disable-next-line @typescript-eslint/no-misused-promises
              submitHandler={submitHandler}
              isLoading={imgGenStatus === "pending"}
            />
            <div>
              {isLoading && (
                <div className="flex h-full w-full items-center justify-center">
                  <Icons.spinner
                    className="h-10 w-10 animate-spin"
                    fill="black"
                  />
                </div>
              )}
              <ImgGallery images={generatedImages as string[]} />
            </div>
          </div>
        </main>
      </Layout>
    </>
  );
}
