"use client";

import { useEffect, useState } from "react";

export default function TimeOnSite() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);

  return <span>{`${seconds}s on the site`}</span>;
}
