"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales } from "@/lib/i18n";

export default function LanguageSwitcher({ label }) {
  const pathname = usePathname();
  // /fr/trails gives trails
  const rest = pathname.split("/").slice(2).join("/");

  return (
    <ul aria-label={label} className="ml-auto flex gap-3">
      {locales.map((locale) => (
        <li key={locale}>
          <Link href={`/${locale}${rest ? `/${rest}` : ""}`} hrefLang={locale} lang={locale}>
            {locale.toUpperCase()}
          </Link>
        </li>
      ))}
    </ul>
  );
}
