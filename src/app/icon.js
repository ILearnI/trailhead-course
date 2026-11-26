import { ImageResponse } from "next/og";

// Next reads these two exports
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

// The default export draws the picture
export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        background: "#0f766e",
        color: "white",
        fontSize: 22,
        borderRadius: 6,
      }}
    >
      T
    </div>,
    size,
  );
}
