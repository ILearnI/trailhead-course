"use client";

export default function GlobalError({ error, retry }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui", padding: "2rem" }}>
        <h1>Trailhead is having a problem</h1>
        <p>{`Reference: ${error.digest}`}</p>
        <button onClick={() => retry()}>Try again</button>
      </body>
    </html>
  );
}
