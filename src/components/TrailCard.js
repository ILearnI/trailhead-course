import Image from "next/image";
import Link from "next/link";
import TrailThumb from "@/components/TrailThumb";
import { Badge } from "@/components/ui";
import FavoriteButton from "@/components/FavoriteButton";
import { cardShell } from "@/components/card-styles";
import { estimateMinutes, formatDuration } from "@/lib/hike-time";

// Which badge for which level
const levelVariant = {
  Easy: "success",
  Moderate: "warning",
  Hard: "neutral",
};

export default function TrailCard({ trail }) {
  return (
    <li className={cardShell}>
      {/* Fixed shape, relative for fill */}
      <div className="relative aspect-[16/10] overflow-hidden rounded-lg">
        <Image
          src={`/trails/${trail.slug}.jpg`}
          alt={trail.name}
          fill
          sizes="(min-width: 1024px) 320px, (min-width: 640px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
      <div className="flex items-center gap-3">
        <TrailThumb trail={trail} size="size-12 text-xl" />
        <div className="flex-1">
          <Link href={`/trails/${trail.slug}`} className="font-medium underline">
            {trail.name}
          </Link>
          <p className="flex items-center gap-2 text-sm text-muted">
            {`${trail.km} km`}
            <Badge variant={levelVariant[trail.level]}>{trail.level}</Badge>
          </p>
          <p className="text-sm text-muted">
            {`About ${formatDuration(estimateMinutes(trail))}`}
          </p>
        </div>
        <FavoriteButton slug={trail.slug} name={trail.name} />
      </div>
      <div className="mt-auto flex justify-between text-sm">
        <Link href={`/trails/${trail.slug}/photo`} className="underline">
          Photo
        </Link>
        <Link href={`/trails/${trail.slug}/reviews`} className="underline">
          Reviews
        </Link>
      </div>
    </li>
  );
}
