export type JSONValue = string | number | boolean | JSONObject | JSONArray;

interface JSONObject {
  [x: string]: JSONValue;
}

interface JSONArray extends Array<JSONValue> {}

export type Event = { data: JSONValue; topic: string; channel: string };

export type SendFunction = (event: string, data: Event) => void;

type InitFunction = (send: SendFunction) => () => void;

export function oldEventStream(request: Request, init: InitFunction) {
  const { readable, writable } = new TransformStream();

  const writeStream = writable.getWriter();

  const encoder = new TextEncoder();

  const send: SendFunction = (event, data) => {
    writeStream.write(encoder.encode(`event: ${event}\n`));
    writeStream.write(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
  };

  const cleanup = init(send);

  let closed = false;

  const close = () => {
    console.log("CLOSED");
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

export async function eventStream(request: Request, init: InitFunction) {
  let cleanup: ReturnType<InitFunction>;
  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();
      const send: SendFunction = (event, data) => {
        controller.enqueue(encoder.encode(`event: ${event}\n`));
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      cleanup = init(send);

      let closed = false;
      const close = () => {
        console.log("CLOSE");
        if (closed) return;
        cleanup();
        closed = true;
        request.signal.removeEventListener("abort", close);
        controller.close();
      };

      request.signal.addEventListener("abort", close);
      if (request.signal.aborted) {
        close();
        return;
      }
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/event-stream" },
  });
}
