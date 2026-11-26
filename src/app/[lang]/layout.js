import Link from "next/link";
import { notFound } from "next/navigation";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { getDictionary } from "@/lib/dictionaries";
import { hasLocale, locales } from "@/lib/i18n";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function LangLayout({ children, params }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = await getDictionary(lang);

  return (
    // The language of this part of the page
    <div lang={lang} className="mx-auto max-w-3xl p-4 md:p-8">
      <nav aria-label={t.nav.sections} className="flex gap-4">
        <Link href={`/${lang}`}>{t.nav.home}</Link>
        <Link href={`/${lang}/trails`}>{t.nav.trails}</Link>
        <LanguageSwitcher label={t.nav.language} />
      </nav>
      {children}
    </div>
  );
}
