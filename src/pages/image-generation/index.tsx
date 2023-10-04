import type * as z from "zod";
import { useState } from "react";
import Head from "next/head";
import type { GetStaticProps, InferGetStaticPropsType } from "next";

import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

import { ImageGenerationPromptForm } from "@/components/openai-playground/image-promp-form";
import { api } from "@/utils/api";
import { Layout } from "@/components/layout";
import { type imgGenFormSchema } from "@/components/openai-playground/image-promp-form";
import { ImgGallery } from "@/components/openai-playground/image-gallery";
import { useSaveImageRequest } from "@/hooks/saveImageRequest";

export type GenerateImageParams = {
  prompt: string;
  numberOfImages: number;
  size: "256x256" | "512x512" | "1024x1024";
};
export default function Page(
  _props: InferGetStaticPropsType<typeof getStaticProps>
) {
  const { t } = useTranslation("image-generation");

  const [imgGenStatus, setImgGenStatus] = useState<
    "idle" | "pending" | "fulfilled" | "rejected"
  >("idle");
  const [generatedImages, setGeneratedImages] = useState<
    (string | undefined)[]
  >([]);

  const { saveUserRequest, isMutationLoading, saveGeneratedImages } =
    useSaveImageRequest();

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
      // add new images to the top of the list to show them first
      setGeneratedImages((prev) => [...imgUrls, ...prev]);
      // save images to bucket and info to db
      await saveGeneratedImages(imgUrls);
    },
  });

  const submitHandler = async (value: z.infer<typeof imgGenFormSchema>) => {
    if (imgGenStatus === "pending") return;
    //save user request to db and get id
    await saveUserRequest({ value });

    // call openai api
    generateImageMutation.mutate({
      prompt: value.prompt,
      numberOfImages: value.n,
      size: value.size,
    });
  };

  const isMutating = imgGenStatus === "pending" || isMutationLoading;
  return (
    <>
      <Head>
        <title>{t("page-title")}</title>
        <meta name="description" content="Cybercap " />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <main className="bg-new-red container flex items-center justify-center ">
          <div className="mt-16 grid w-full grid-cols-1 gap-8 md:grid-cols-[300px_1fr]">
            <ImageGenerationPromptForm
              // eslint-disable-next-line @typescript-eslint/no-misused-promises
              submitHandler={submitHandler}
              isLoading={false}
            />
            <ImgGallery images={generatedImages as string[]} />
          </div>
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
      ["image-generation", "top-panel"],
      null,
      ["en", "fr"]
    )),
  },
});
