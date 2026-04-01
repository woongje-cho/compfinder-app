import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { MobileMenu } from "./MobileMenu";
import { LocaleSwitcher } from "./LocaleSwitcher";

export function Navbar() {
  const t = useTranslations("nav");

  const NAV_LINKS = [
    { href: "/competitions" as const, label: t("competitions") },
    { href: "/workshops" as const, label: t("workshops") },
    { href: "/series" as const, label: t("series") },
    { href: "/timeline" as const, label: t("timeline") },
    { href: "/submit" as const, label: t("submit") },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
      <nav className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-zinc-50 text-sm font-bold text-zinc-950">
            C
          </div>
          <span className="text-lg font-bold text-zinc-50">CompFinder</span>
        </Link>

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
          <Link
            href="/competitions"
            className="rounded-md p-2 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-50"
          >
            <Search className="h-4 w-4" />
          </Link>
          <LocaleSwitcher />
          <MobileMenu />
        </div>
      </nav>
    </header>
  );
}
