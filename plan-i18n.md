# i18n Plan — Korean/English Language Toggle

## Approach
- Library: `next-intl` (App Router native support)
- Routing: `/ko/competitions`, `/en/competitions` (locale prefix)
- Default locale: `ko`
- Toggle: Flag button in Navbar (🇰🇷 / 🇺🇸)

## File Structure Changes

```
src/
├── i18n/
│   ├── request.ts          # next-intl config
│   └── routing.ts          # locale routing config
├── messages/
│   ├── ko.json             # Korean translations
│   └── en.json             # English translations
├── app/
│   └── [locale]/           # All pages move under [locale]
│       ├── layout.tsx
│       ├── page.tsx
│       ├── competitions/
│       ├── series/
│       ├── timeline/
│       └── submit/
├── middleware.ts            # Locale detection + redirect
└── components/
    └── layout/
        └── LocaleSwitcher.tsx  # Flag toggle component
```

## What Gets Translated
1. **UI strings**: Nav labels, buttons, headings, descriptions, filter labels, empty states, footer
2. **NOT translated**: Competition data (names, descriptions stay as-is from JSON — they're in English)
3. **Date formatting**: `formatDate()` uses locale-aware formatting

## Implementation Steps
1. Install `next-intl`
2. Create `messages/ko.json` + `messages/en.json`
3. Create `i18n/routing.ts` + `i18n/request.ts`
4. Add `middleware.ts` for locale detection
5. Move all pages under `app/[locale]/`
6. Wrap layout with `NextIntlClientProvider`
7. Replace hardcoded strings with `useTranslations()` / `getTranslations()`
8. Add `LocaleSwitcher` component (flag button) to Navbar
9. Build & test

## Estimated Scope
- ~15 files modified
- 2 new JSON translation files (~80 keys each)
- 5 new config/util files
