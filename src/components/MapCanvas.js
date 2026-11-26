"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default function MapCanvas({ points }) {
  const ref = useRef(null);

  useEffect(() => {
    const map = L.map(ref.current);

    points.forEach(({ name, position }) => {
      L.circleMarker(position, { radius: 8 }).addTo(map).bindTooltip(name);
    });
    map.fitBounds(points.map((point) => point.position), { padding: [24, 24] });

    return () => map.remove();
  }, [points]);

  return <div ref={ref} className="mt-4 h-80 w-full rounded-xl border" />;
}
