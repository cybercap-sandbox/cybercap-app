import Link from "next/link";

export function Logo() {
  return (
    <Link
      href={"/"}
      className="flex items-center justify-center duration-100 hover:scale-110"
    >
      <span className=" text-xl uppercase">Cybercap</span>
    </Link>
  );
}
