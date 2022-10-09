export type SendFunction = (event: string, data: string) => void;

type InitFunction = (send: SendFunction) => () => void;

export function eventStream(request: Request, init: InitFunction) {
  const { readable, writable } = new TransformStream();

  const writeStream = writable.getWriter();

  const encoder = new TextEncoder();

  const send: SendFunction = (event, data) => {
    writeStream.write(encoder.encode(`event: ${event}\n`));
    writeStream.write(encoder.encode(`data: ${data}\n\n`));
  };

  const cleanup = init(send);

  let closed = false;

  const close = () => {
    if (closed) return;

    cleanup();
    closed = true;
    request.signal.removeEventListener("abort", close);
    writable.close();
  };

  request.signal.addEventListener("abort", close);

  writeStream.closed.then(() => {
    close();
  });

  if (request.signal.aborted) {
    close();
  }

  return new Response(readable, {
    status: 200,
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
