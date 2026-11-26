import Image from "next/image";

export default function TrailPhoto({ trail }) {
  return (
    <Image
      src={`/trails/${trail.slug}.jpg`}
      alt={trail.name}
      // Reserve the space before it loads
      width={320}
      height={200}
      className="rounded-2xl"
    />
  );
}
