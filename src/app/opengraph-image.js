import { ImageResponse } from "next/og";
import { OgCard } from "@/lib/og-card";

export const alt = "Trailhead, trails and reviews";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// The image of every page that has none of its own
export default function Image() {
  return new ImageResponse(
    <OgCard title="Trailhead" line="Trails and reviews for people who love the outdoors." />,
    size,
  );
}
