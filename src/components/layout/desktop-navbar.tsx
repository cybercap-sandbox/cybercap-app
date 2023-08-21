import * as React from "react";
import { cn } from "@/utils/class-merge";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { usePathname } from "next/navigation";
import { menuItems } from "@/data/navigation";
import Link from "next/link";

export function DesktopNavbar() {
  const pathname = usePathname();

  return (
    <NavigationMenu>
      <NavigationMenuList>
        {menuItems.map((item) => (
          <NavigationMenuItem key={item.href}>
            <Link
              className={cn(
                navigationMenuTriggerStyle(),
                pathname === item.href
                  ? " border  text-accent-foreground"
                  : "text-accent-foreground"
              )}
              href={item.href}
            >
              {item.title}
            </Link>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
