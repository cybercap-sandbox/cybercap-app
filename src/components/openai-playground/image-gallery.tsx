import Image from "next/image";
import Link from "next/link";
import { Icons } from "../icons";

export function ImgGallery({ images }: { images: string[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {images.map((img, i) => (
        <div key={i} className="group relative h-fit w-fit ">
          <div className="absolute inset-0 hidden bg-black/50 group-hover:block">
            <Link
              {...{ target: "_blank", rel: "noopener noreferrer" }}
              href={img}
              className="absolute inset-0 flex items-center justify-center gap-5 text-2xl font-bold text-white underline"
            >
              <Icons.download className="h-8 w-8" fill="white" />
              Download
            </Link>
          </div>
          <Image
            alt="image generated openai from prompt"
            src={img}
            loading="lazy"
            width={400}
            height={400}
            className="rounded-lg"
          />
        </div>
      ))}
    </div>
  );
}
