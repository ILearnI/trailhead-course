import { countReviews } from "@/dal/review-count";

export async function GET(request) {
  const encoder = new TextEncoder();
  let timer;
  let beat;
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
      // If the line breaks, retry in 3 s
      controller.enqueue(encoder.encode("retry: 3000\n\n"));
      await check();
      timer = setInterval(check, 1000);
      // A comment: the line is not idle
      beat = setInterval(() => {
        controller.enqueue(encoder.encode(": ping\n\n"));
      }, 10000);
      // The caller left: stop, and free the stream
      request.signal.addEventListener("abort", () => {
        clearInterval(timer);
        clearInterval(beat);
        controller.close();
      });
    },
    cancel() {
      clearInterval(timer);
      clearInterval(beat);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
    },
  });
}
