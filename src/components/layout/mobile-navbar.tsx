import * as React from "react";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { cn } from "@/utils/class-merge";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { menuItems } from "@/data/navigation";

export function MobileNavbar() {
  const { t } = useTranslation("top-panel");
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>
            {t("mobile-menu-label")}
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className=" w-fit p-2">
              {menuItems.map((component) => (
                <Link
                  key={component.key}
                  href={component.href}
                  className={cn(navigationMenuTriggerStyle())}
                >
                  {t(`menu-items.${component.key}`)}
                </Link>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "hover:bg-light-green/50 focus:bg-light-gray/50 block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:text-accent-foreground focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
