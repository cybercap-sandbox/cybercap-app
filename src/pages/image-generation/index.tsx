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
      const imgUrls = data.response?.map((d) => d.url);
      if (!imgUrls) return;
      setGeneratedImages((prev) => [...imgUrls, ...prev]);
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
  const submitHandler = (values: z.infer<typeof imgGenFormSchema>) => {
    generateImg({
      prompt: values.prompt,
      numberOfImages: values.n,
      size: values.size,
    });
  };

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
              submitHandler={submitHandler}
              isLoading={imgGenStatus === "pending"}
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
