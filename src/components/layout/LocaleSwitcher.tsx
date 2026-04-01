"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";

export function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  function switchLocale() {
    const next = locale === "ko" ? "en" : "ko";
    router.replace(pathname, { locale: next });
  }

  return (
    <button
      onClick={switchLocale}
      className="rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-zinc-800"
      aria-label="Switch language"
      title={locale === "ko" ? "Switch to English" : "한국어로 전환"}
    >
      {locale === "ko" ? "🇺🇸" : "🇰🇷"}
    </button>
  );
}
