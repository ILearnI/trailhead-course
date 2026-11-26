import { Suspense } from "react";
import NavLink from "./NavLink";
import FavoritesCount from "./FavoritesCount";
import TrailCount from "./TrailCount";
import ThemeToggle from "./ThemeToggle";
import UserMenu from "./UserMenu";

const links = [
  { href: "/", label: "Trailhead" },
  { href: "/trails", label: "Trails" },
  { href: "/conditions", label: "Conditions" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/map", label: "Map" },
  { href: "/guides/getting-started", label: "Guides" },
  { href: "/about", label: "About" },
];

export default function SiteHeader() {
  return (
    <header className="flex flex-wrap gap-x-4 gap-y-1 sm:gap-x-6 border-b px-4 md:px-8 py-3 font-medium">
      <nav aria-label="Main" className="flex flex-wrap gap-x-4 gap-y-1 sm:gap-x-6">
      {links.map((link) => (
        <NavLink key={link.href} href={link.href}>
          {link.label}
        </NavLink>
      ))}
      </nav>
      <TrailCount />
      <ThemeToggle />
      <FavoritesCount />
      <Suspense fallback={<span className="text-sm">...</span>}>
        <UserMenu />
      </Suspense>
    </header>
  );
}
