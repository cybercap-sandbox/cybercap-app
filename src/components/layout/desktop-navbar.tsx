import * as React from "react";
import { cn } from "@/utils/class-merge";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { menuItems } from "@/data/navigation";
import { useTranslation } from "next-i18next";

export function DesktopNavbar() {
  const pathname = usePathname();
  const { t } = useTranslation("top-panel");

  return (
    <NavigationMenu>
      <NavigationMenuList>
        {menuItems.map((item) => (
          <NavigationMenuItem key={item.href}>
            <Link
              data-cy={`desktop-navbar-${item.key}`}
              className={cn(
                navigationMenuTriggerStyle(),
                "border text-accent-foreground",
                pathname !== item.href && "border-transparent"
              )}
              href={item.href}
            >
              {t(`menu-items.${item.key}`)}
            </Link>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
