import type * as z from "zod";
import { useEffect, useState } from "react";
import Head from "next/head";
import type { GetStaticProps, InferGetStaticPropsType } from "next";

import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { useSession } from "next-auth/react";

import { ImageGenerationPromptForm } from "@/components/openai-images-playground/image-promp-form";
import { api } from "@/utils/api";
import { Layout } from "@/components/layout";
import { type imgGenFormSchema } from "@/components/openai-images-playground/image-promp-form";
import {
  type ImageWithStatus,
  ImgGallery,
} from "@/components/openai-images-playground/image-gallery";
import { useImageGenerationRequest } from "@/hooks/useImageGenerationRequest";
import { LoginRequiredMessage } from "@/components/layout/login-required-message";

export type GenerateImageParams = {
  prompt: string;
  numberOfImages: number;
  size: "256x256" | "512x512" | "1024x1024";
};

export default function Page(
  _props: InferGetStaticPropsType<typeof getStaticProps>
) {
  const { t } = useTranslation("image-generation");
  const { status } = useSession();

  const [imgGenStatus, setImgGenStatus] = useState<
    "idle" | "pending" | "fulfilled" | "rejected"
  >("idle");
  const [generatedImages, setGeneratedImages] = useState<ImageWithStatus[]>(
    [] as ImageWithStatus[]
  );

  const {
    saveUserRequest,
    saveGeneratedImages,
    initialLoadingGeneratedImages,
  } = useImageGenerationRequest(setGeneratedImages);

  useEffect(() => {
    if (initialLoadingGeneratedImages) {
      setGeneratedImages(() => [
        ...Array.from({ length: 3 }, () => ({ url: "", loaded: false })),
      ]);
    } else {
      setGeneratedImages((prev) => [...prev.filter((_) => _.url !== "")]);
    }
  }, [initialLoadingGeneratedImages]);

  const generateImageMutation = api.openai.generateImage.useMutation({
    onMutate: () => {
      setImgGenStatus("pending");
    },
    onError: () => {
      setImgGenStatus("rejected");
    },
    onSuccess: async (data) => {
      setImgGenStatus("fulfilled");
      if (!data.response) return;
      // get image urls from openai response
      const imgUrls = data.response?.map((d) => d.url!);
      const imgListWithStatus: ImageWithStatus[] = imgUrls.map((url) => ({
        url,
        loaded: false,
      }));
      // add new images to the top of the list to show them first
      // and remove the skeleton images
      setGeneratedImages((prev) => [
        ...imgListWithStatus,
        ...prev.filter((_) => _.url !== ""),
      ]);
      // save images to bucket and info to db
      await saveGeneratedImages(imgUrls);
    },
  });

  const submitHandler = async (value: z.infer<typeof imgGenFormSchema>) => {
    if (imgGenStatus === "pending") return;
    // add the same number of generated images as skeleton images to the top of the list
    // while waiting for the response from openai
    const skeletonImages: ImageWithStatus[] = Array.from(
      { length: value.n },
      () => ({ url: "", loaded: false })
    );
    setGeneratedImages((prev) => [...skeletonImages, ...prev]);
    //save user request to db and get id
    await saveUserRequest({ value });

    // call openai api
    generateImageMutation.mutate({
      prompt: value.prompt,
      numberOfImages: value.n,
      size: value.size,
    });
  };

  const isLoading = imgGenStatus === "pending";
  return (
    <>
      <Head>
        <title>{t("page-title")}</title>
        <meta name="description" content="Cybercap " />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <main className="bg-new-red container flex items-center justify-center ">
          {status === "authenticated" && (
            <div className="mt-16 grid w-full grid-cols-1 gap-8 md:grid-cols-[300px_1fr]">
              <ImageGenerationPromptForm
                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                submitHandler={submitHandler}
                isLoading={isLoading}
              />
              <ImgGallery
                images={generatedImages}
                setImages={setGeneratedImages}
              />
            </div>
          )}
          {status === "unauthenticated" && <LoginRequiredMessage />}
        </main>
      </Layout>
    </>
  );
}

export const getStaticProps: GetStaticProps = async ({
  locale,
  defaultLocale,
}) => ({
  props: {
    ...(await serverSideTranslations(
      locale ?? defaultLocale ?? "en",
      ["image-generation", "top-panel", "common"],
      null,
      ["en", "fr"]
    )),
  },
});
