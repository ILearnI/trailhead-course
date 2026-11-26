"use client";

import { Activity, useState } from "react";

export default function Tabs({ tabs }) {
  const [active, setActive] = useState(0);

  return (
    <div className="mt-6">
      <div className="flex gap-2" role="tablist">
        {tabs.map((tab, index) => (
          <button
            key={tab.label}
            role="tab"
            aria-selected={index === active}
            onClick={() => setActive(index)}
            className={index === active ? "font-semibold underline" : "text-zinc-500"}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="mt-3">
        {tabs.map((tab, index) => (
          <Activity key={tab.label} mode={index === active ? "visible" : "hidden"}>
            {tab.content}
          </Activity>
        ))}
      </div>
    </div>
  );
}
