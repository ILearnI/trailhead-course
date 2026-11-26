import { alternates } from "@/lib/alternates";
import { getTrail, listTrails } from "@/dal/trails";
import { getDictionary } from "@/lib/dictionaries";
import { describeTrail } from "@/lib/describe-trail";
import { fill, formatDistance, plural } from "@/lib/format";

async function TrailItem({ slug, lang, t }) {
  const trail = await getTrail(slug);
  const { text, lang: textLang } = describeTrail(trail, lang);

  return (
    <li data-trail={slug} className="mt-3">
      <strong>{trail.name}</strong>
      <span data-km={slug}>{`, ${formatDistance(trail.km, lang)}`}</span>
      <span data-level={slug}>{`, ${t.levels[trail.level]}`}</span>
      <p lang={textLang} data-text={slug}>
        {text}
      </p>
    </li>
  );
}

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const t = await getDictionary(lang);
  const { title, description } = t.trails;
  return { title, description, alternates: alternates(lang, "/trails") };
}

export default async function LangTrails({ params }) {
  const { lang } = await params;
  const t = await getDictionary(lang);
  const trails = await listTrails();

  return (
    <main className="mt-8">
      <h1 className="text-3xl font-semibold">{t.trails.title}</h1>
      <p className="mt-2">{t.trails.intro}</p>
      <p data-part="count">
        {fill(plural(lang, trails.length, t.trails.count), { count: trails.length })}
      </p>
      <ul className="mt-4 list-disc pl-6">
        {trails.map((trail) => (
          <TrailItem key={trail.slug} slug={trail.slug} lang={lang} t={t} />
        ))}
      </ul>
    </main>
  );
}
