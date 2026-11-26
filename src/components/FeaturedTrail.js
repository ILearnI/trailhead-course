import Image from "next/image";
import { blurPhoto } from "@/lib/blur";

// The photos live on another server
const PHOTOS = "http://localhost:4001";

export default function FeaturedTrail() {
  return (
    <Image
      src={`${PHOTOS}/alpine-lake.jpg`}
      alt="Alpine Lake Loop"
      width={1200}
      height={500}
      // Pick the file for the real width
      sizes="(min-width: 1024px) 64rem, 100vw"
      placeholder="blur"
      blurDataURL={blurPhoto}
      // The main image: fetch it at once
      loading="eager"
      fetchPriority="high"
      className="mt-4 h-64 w-full rounded-2xl object-cover"
    />
  );
}
