import { createNanoEvents } from "nanoevents";
import { z } from "zod";
import { eventStream } from "../helpers/eventStream";

const receiveEvent = z.object({
  data: z.string(),
  type: z.string(),
});

export class EmitterDurableObject implements DurableObject {
  emitter = createNanoEvents();

  async fetch(request: Request): Promise<Response> {
    console.log(request.method, request.url);

    if (request.method === "POST") {
      return this.handleMessageReceived(request);
    }

    if (request.method === "GET") {
      return this.handleMessageSubscribe(request);
    }

    throw new Error("Method not implemented");
  }

  async handleMessageReceived(request: Request): Promise<Response> {
    if (request.headers.get("content-type") !== "application/json") {
      return new Response("Must send json", { status: 400 });
    }

    const result = await request.json();

    const parsedResult = receiveEvent.safeParse(result);

    if (!parsedResult.success) {
      return new Response("Request does not match event shape", {
        status: 400,
      });
    }

    this.emitter.emit(parsedResult.data.type, parsedResult.data.data);

    return new Response("ok");
  }

  async handleMessageSubscribe(request: Request): Promise<Response> {
    const url = new URL(request.url);

    const [, topic] = url.pathname.split("/");

    return eventStream(request, (send) => {
      const handle = (message: string) => {
        send("message", message);
      };

      return this.emitter.on(topic, handle);
    });
  }
}
