import { Logo } from "./logo";
import { DesktopNavbar } from "./desktop-navbar";
import { MobileNavbar } from "./mobile-navbar";
import { AuthStatus } from "./auth-status";

export function TopPanel() {
  return (
    <div className="container mx-auto flex items-center justify-between gap-4 border-b-2 py-5 md:gap-7">
      <div className="flex w-fit justify-between gap-14 md:justify-start">
        <Logo />
        <div className="hidden md:block">
          <DesktopNavbar />
        </div>
        <div className="block md:hidden">
          <MobileNavbar />
        </div>
      </div>
      <div className="flex w-fit justify-end gap-4 md:gap-3">
        <AuthStatus />
      </div>
    </div>
  );
}
