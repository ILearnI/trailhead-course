// The card of our images: title and line
export function OgCard({ title, line }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: "100%",
        height: "100%",
        padding: 72,
        background: "#064e3b",
        color: "white",
      }}
    >
      <div style={{ fontSize: 36, opacity: 0.8 }}>Trailhead</div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: 88, fontWeight: 700 }}>{title}</div>
        <div style={{ fontSize: 40, marginTop: 24 }}>{line}</div>
      </div>
    </div>
  );
}
