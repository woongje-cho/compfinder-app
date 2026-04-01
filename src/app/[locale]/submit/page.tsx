import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CATEGORY_CONFIG } from "@/lib/constants";
import type { Category } from "@/lib/types";

export const metadata: Metadata = {
  title: "Submit a Competition",
  description: "Know a competition we're missing? Submit it here.",
};

export default async function SubmitPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("submit");

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-2 text-3xl font-bold text-zinc-50">{t("title")}</h1>
      <p className="mb-8 text-zinc-400">{t("description")}</p>

      <form action="https://github.com" method="GET" className="space-y-6">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-zinc-300">
            {t("nameLabel")}
          </label>
          <input
            id="name" name="name" type="text" required
            placeholder={t("namePlaceholder")}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-zinc-50 placeholder-zinc-500 transition-colors focus:border-zinc-500 focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="url" className="mb-1.5 block text-sm font-medium text-zinc-300">
            {t("urlLabel")}
          </label>
          <input
            id="url" name="url" type="url" required
            placeholder="https://..."
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-zinc-50 placeholder-zinc-500 transition-colors focus:border-zinc-500 focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="deadline" className="mb-1.5 block text-sm font-medium text-zinc-300">
            {t("deadlineLabel")}
          </label>
          <input
            id="deadline" name="deadline" type="date"
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-zinc-50 transition-colors focus:border-zinc-500 focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="category" className="mb-1.5 block text-sm font-medium text-zinc-300">
            {t("categoryLabel")}
          </label>
          <select
            id="category" name="category"
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-zinc-50 transition-colors focus:border-zinc-500 focus:outline-none"
          >
            <option value="">{t("categoryPlaceholder")}</option>
            {(Object.keys(CATEGORY_CONFIG) as Category[]).map((cat) => (
              <option key={cat} value={cat}>
                {CATEGORY_CONFIG[cat].icon} {CATEGORY_CONFIG[cat].label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="description" className="mb-1.5 block text-sm font-medium text-zinc-300">
            {t("descriptionLabel")}
          </label>
          <textarea
            id="description" name="description" rows={3}
            placeholder={t("descriptionPlaceholder")}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-zinc-50 placeholder-zinc-500 transition-colors focus:border-zinc-500 focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-zinc-300">
            {t("emailLabel")} <span className="text-zinc-500">{t("emailOptional")}</span>
          </label>
          <input
            id="email" name="email" type="email"
            placeholder={t("emailPlaceholder")}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-zinc-50 placeholder-zinc-500 transition-colors focus:border-zinc-500 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-zinc-50 py-2.5 text-sm font-semibold text-zinc-950 transition-colors hover:bg-zinc-200"
        >
          {t("submitButton")}
        </button>

        <p className="text-xs text-zinc-500">{t("notice")}</p>
      </form>
    </div>
  );
}
