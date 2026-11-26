import Link from "next/link";
import { getDictionary } from "@/lib/dictionaries";
import { fill, formatDate, formatList } from "@/lib/format";
import { alternates } from "@/lib/alternates";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const t = await getDictionary(lang);
  const { title, intro } = t.home;
  return { title, description: intro, alternates: alternates(lang, "") };
}

export default async function LangHome({ params }) {
  const { lang } = await params;
  const t = await getDictionary(lang);

  const date = formatDate(new Date("2027-03-20"), lang);
  const list = formatList(Object.values(t.regions), lang);

  return (
    <main className="mt-8">
      <h1 className="text-3xl font-semibold">{t.home.title}</h1>
      <p className="mt-2">{t.home.intro}</p>
      <p data-part="season">{fill(t.home.season, { date })}</p>
      <p data-part="regions">{fill(t.home.regions, { list })}</p>
      <Link href={`/${lang}/trails`} className="mt-4 inline-block underline">
        {t.home.cta}
      </Link>
    </main>
  );
}
