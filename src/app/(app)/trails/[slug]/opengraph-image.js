import { ImageResponse } from "next/og";
import { getTrail } from "@/dal/trails";
import { OgCard } from "@/lib/og-card";

// The text of the image, for screen readers
export const alt = "A trail of Trailhead";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }) {
  const { slug } = await params;
  const trail = await getTrail(slug);
  const line = trail ? `${trail.km} km, ${trail.level}, ${trail.region}` : "";

  return new ImageResponse(
    <OgCard title={trail?.name ?? "A trail"} line={line} />,
    size,
  );
}
