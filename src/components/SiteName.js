"use client";

export default function SiteName() {
  return (
    <p className="mt-2 text-sm text-zinc-500">
      {`Welcome to ${process.env.NEXT_PUBLIC_SITE_NAME}`}
    </p>
  );
}
