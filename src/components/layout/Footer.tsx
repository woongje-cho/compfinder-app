import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function Footer() {
  const t = useTranslations();

  return (
    <footer className="border-t border-zinc-800 bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link href="/" className="mb-1 flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-zinc-800 text-xs font-bold text-zinc-300">
                C
              </div>
              <span className="text-sm font-semibold text-zinc-400">CompFinder</span>
            </Link>
            <p className="text-xs text-zinc-600">
              {t("footer.tagline")}
            </p>
          </div>
          <div className="flex items-center gap-6 text-sm text-zinc-500">
            <Link href="/competitions" className="transition-colors hover:text-zinc-300">{t("nav.competitions")}</Link>
            <Link href="/series" className="transition-colors hover:text-zinc-300">{t("nav.series")}</Link>
            <Link href="/timeline" className="transition-colors hover:text-zinc-300">{t("nav.timeline")}</Link>
            <Link href="/submit" className="transition-colors hover:text-zinc-300">{t("nav.submit")}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
