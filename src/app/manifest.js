// Describes the app to the browser
export default function manifest() {
  return {
    name: "Trailhead",
    short_name: "Trailhead",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0f766e",
    // Reuse the icon from apple-icon.js
    icons: [{ src: "/apple-icon", sizes: "180x180", type: "image/png" }],
  };
}
