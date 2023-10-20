import Link from "next/link";
import { Roboto_Slab } from "next/font/google";
import { cn } from "@/utils/class-merge";

export const roboto_font = Roboto_Slab({
  subsets: ["latin"],
  weight: ["700"],
});

export function Logo({
  variant = "default",
  size = "default",
}: {
  size?: "default" | "small";
  variant?: "default" | "white";
}) {
  return (
    <Link
      data-cy={"logoLink"}
      href={"/"}
      className="flex items-center justify-center duration-100 hover:scale-110"
    >
      <span
        data-cy={"logoTitle"}
        className={cn(
          "font-bold ",
          variant === "white" ? "text-white" : "text-black",
          size === "small" ? "text-lg" : "text-2xl",
          roboto_font.className
        )}
      >
        CyberCap
      </span>
    </Link>
  );
}
