"use client";

import { usePathname } from "next/navigation";

export default function CurrentPath() {
  const pathname = usePathname();

  return <span className="ml-auto font-mono">{pathname}</span>;
}
