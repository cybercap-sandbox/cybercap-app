import { type Dispatch, type SetStateAction } from "react";
import Image from "next/image";
import Link from "next/link";
import { Download } from "@phosphor-icons/react";
import { useTranslation } from "next-i18next";
import { cn } from "@/utils/class-merge";

function getUrlToDownloadImage(imgUrl: string) {
  return `/api/download_from_bucket/${encodeURIComponent(imgUrl)}`;
}
export type ImageWithStatus = { url: string; loaded: boolean };

export function ImgGallery({
  images,
  setImages: setImagesWithStatus,
}: {
  images: ImageWithStatus[];
  setImages: Dispatch<SetStateAction<ImageWithStatus[]>>;
}) {
  function handleChangeImgLoadingStatus(index: number) {
    setImagesWithStatus((prev) =>
      prev.map((img, i) => {
        if (index === i) return { ...img, loaded: true };
        return img;
      })
    );
  }

  return (
    <div className="grid h-fit w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 ">
      {images.map((img, i) => (
        <div key={i} className="group relative ">
          {!img.loaded && <ImageSkeleton />}
          {img.loaded && <DownloadLayer imgUrl={img.url} />}
          {img.url && (
            <Image
              alt="image generated by openai from prompt"
              src={img.url}
              width={400}
              height={400}
              priority
              className={cn("rounded-lg", { hidden: !img.loaded })}
              onLoadingComplete={() => handleChangeImgLoadingStatus(i)}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export function DownloadLayer({ imgUrl }: { imgUrl: string }) {
  const { t } = useTranslation("image-generation");
  return (
    <div className="absolute inset-0 hidden rounded-lg bg-black/50 group-hover:block">
      <Link
        download={"image"}
        href={`${getUrlToDownloadImage(imgUrl)}`}
        className="absolute inset-0 flex items-center justify-center gap-5 text-2xl font-bold text-white underline"
      >
        <Download size={32} />
        {t("download-button")}
      </Link>
    </div>
  );
}
export function ImageSkeleton() {
  return (
    <div className=" aspect-square h-full w-full animate-pulse rounded-lg bg-gray-500">
      &nbsp;
    </div>
  );
}
