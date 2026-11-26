import { countReviews } from "@/dal/review-count";

export async function GET(request) {
  const encoder = new TextEncoder();
  let timer;
  let last = null;

  const stream = new ReadableStream({
    async start(controller) {
      // Send an event only when it changed
      const check = async () => {
        const total = await countReviews();
        if (total === last) return;
        last = total;
        const data = JSON.stringify({ reviews: total });
        controller.enqueue(encoder.encode(`event: count\ndata: ${data}\n\n`));
      };
      await check();
      timer = setInterval(check, 1000);
      // The caller left: stop, and free the stream
      request.signal.addEventListener("abort", () => {
        clearInterval(timer);
        controller.close();
      });
    },
    cancel() {
      clearInterval(timer);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
    },
  });
}
