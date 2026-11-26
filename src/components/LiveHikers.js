"use client";

import useSWR from "swr";

// Receives the key (the address), returns the data
const fetcher = (url) => fetch(url).then((res) => res.json());

export default function LiveHikers({ initial }) {
  const { data, error, isLoading } = useSWR(
    "http://localhost:4002/count?key=hikers",
    fetcher,
    { refreshInterval: 2000, fallbackData: initial },
  );
  if (error) return <p>Could not load the hikers.</p>;
  if (isLoading) return <p>Loading...</p>;
  return <p>{`Hikers now: ${data.count}`}</p>;
}
