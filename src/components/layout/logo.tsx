import Link from "next/link";
import { Roboto_Slab } from "next/font/google";
import { cn } from "@/utils/class-merge";

export const roboto_font = Roboto_Slab({
  subsets: ["latin"],
  weight: ["700"],
});

export function Logo() {
  return (
    <Link
      href={"/"}
      className="flex items-center justify-center duration-100 hover:scale-110"
    >
      <span className={cn("text-2xl font-bold ", roboto_font.className)}>
        CyberCap
      </span>
    </Link>
  );
}
