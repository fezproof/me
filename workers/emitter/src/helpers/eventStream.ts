export type SendFunction = (event: string, data: string) => void;

type InitFunction = (send: SendFunction) => () => void;

export function eventStream(request: Request, init: InitFunction) {
  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();

      const send: SendFunction = (event, data) => {
        controller.enqueue(encoder.encode(`event: ${event}\n`));
        controller.enqueue(encoder.encode(`data: ${data}\n\n`));
      };
      const cleanup = init(send);

      let closed = false;

      const close = () => {
        if (closed) return;

        cleanup();
        closed = true;
        request.signal.removeEventListener("abort", close);
        controller.close();
      };

      request.signal.addEventListener("abort", close);

      if (request.signal.aborted) {
        close();
      }
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/event-stream" },
  });
}
