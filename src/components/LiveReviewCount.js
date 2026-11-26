"use client";

import useSWR from "swr";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function LiveReviewCount() {
  const { data, error } = useSWR("/api/reviews/count", fetcher, {
    // Ask again every 5 seconds
    refreshInterval: 5000,
    // Ask at once when the tab gets the focus back
    revalidateOnFocus: true,
    // A tab that nobody sees does not ask
    refreshWhenHidden: false,
  });
  if (error) return <p>Could not load the count.</p>;
  if (!data) return <p>Loading...</p>;
  return <p>{`Reviews on the site: ${data.reviews}`}</p>;
}
