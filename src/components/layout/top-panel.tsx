import { Logo } from "./logo";
import { DesktopNavbar } from "./desktop-navbar";

export function TopPanel() {
  return (
    <div className="container mx-auto flex items-center justify-between gap-4 border-b-2 py-5 md:gap-7">
      <div className="flex gap-14 ">
        <Logo />
        <DesktopNavbar />
      </div>
      <div className="flex w-fit justify-end gap-4 md:gap-3"></div>
    </div>
  );
}
