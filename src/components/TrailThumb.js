import { ViewTransition } from "react";

const colors = {
  Easy: "bg-emerald-700",
  Moderate: "bg-amber-700",
  Hard: "bg-rose-700",
};

const base = "flex items-center justify-center rounded-xl font-bold text-white";

export default function TrailThumb({ trail, size }) {
  return (
    <ViewTransition name={`trail-${trail.slug}`} share="morph" default="none">
      <div className={`${colors[trail.level]} ${size} ${base}`}>
        {trail.name[0]}
      </div>
    </ViewTransition>
  );
}
