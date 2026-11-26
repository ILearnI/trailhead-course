// A slow script of somebody else, for the lesson
const code = `
  performance.mark("widget-loaded");
  const badge = document.createElement("div");
  badge.textContent = "Chat with us";
  badge.style.padding = "8px";
  document.body.append(badge);
`;

export async function GET() {
  // The vendor is slow today
  await new Promise((resolve) => setTimeout(resolve, 1500));
  return new Response(code, {
    headers: { "Content-Type": "application/javascript" },
  });
}
