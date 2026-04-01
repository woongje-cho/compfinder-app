import Link from "next/link";
import { Search } from "lucide-react";
import { MobileMenu } from "./MobileMenu";

const NAV_LINKS = [
  { href: "/competitions", label: "Competitions" },
  { href: "/series", label: "Series" },
  { href: "/timeline", label: "Timeline" },
  { href: "/submit", label: "Submit" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
      <nav className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-zinc-50 text-sm font-bold text-zinc-950">
            C
          </div>
          <span className="text-lg font-bold text-zinc-50">CompFinder</span>
        </Link>

        {/* Nav links — hidden on mobile */}
        <div className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-zinc-400 transition-colors hover:text-zinc-50"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-1">
          {/* Search link */}
          <Link
            href="/competitions?focus=search"
            className="rounded-md p-2 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-50"
          >
            <Search className="h-4 w-4" />
          </Link>

          {/* Mobile hamburger */}
          <MobileMenu />
        </div>
      </nav>
    </header>
  );
}
