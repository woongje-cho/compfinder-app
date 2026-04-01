"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const t = useTranslations("nav");

  const NAV_LINKS = [
    { href: "/competitions" as const, label: t("competitions") },
    { href: "/workshops" as const, label: t("workshops") },
    { href: "/series" as const, label: t("series") },
    { href: "/timeline" as const, label: t("timeline") },
    { href: "/submit" as const, label: t("submit") },
  ];

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(!open)}
        className="rounded-md p-2 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-50"
        aria-label="Toggle menu"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-14 z-50 border-b border-zinc-800 bg-zinc-950/95 backdrop-blur-md">
          <nav className="mx-auto max-w-7xl space-y-1 px-4 py-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="block rounded-md px-3 py-2 text-sm text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-zinc-50"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}
