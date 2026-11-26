import Image from "next/image";

// The photo of a trail, if it has one
export default function TrailCover({ trail }) {
  if (!trail.photo) return null;
  return (
    <Image
      src={`/photos/${trail.photo}`}
      alt={`Photo of ${trail.name}`}
      width={640}
      height={360}
      sizes="(min-width: 768px) 640px, 100vw"
      className="mt-4 h-auto w-full rounded-xl"
      priority
    />
  );
}
