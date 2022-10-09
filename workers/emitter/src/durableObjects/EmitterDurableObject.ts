import { createNanoEvents } from "nanoevents";
import { z } from "zod";
import type { JSONValue } from "../helpers/eventStream";
import { eventStream } from "../helpers/eventStream";

const receiveEventSchema = z.object({
  data: z.string(),
  topic: z.string(),
});

const subscribeParamsSchema = z.object({
  topic: z.string(),
  channel: z.string().optional(),
});

type Emitter = Record<string, (data: JSONValue) => void>;

export class EmitterDurableObject implements DurableObject {
  emitter = createNanoEvents<Emitter>();

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

    const parsedResult = receiveEventSchema.safeParse(result);

    if (!parsedResult.success) {
      return new Response("Request does not match event shape", {
        status: 400,
      });
    }

    const { data: rawData, topic } = parsedResult.data;

    let data: JSONValue;

    try {
      data = JSON.parse(rawData);
    } catch (error) {
      data = rawData;
    }

    this.emitter.emit(topic, data);

    return new Response(JSON.stringify({ data, topic }), {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      status: 200,
    });
  }

  async handleMessageSubscribe(request: Request): Promise<Response> {
    const url = new URL(request.url);

    const params = Object.fromEntries(url.searchParams);

    const result = subscribeParamsSchema.safeParse(params);

    if (!result.success) {
      return new Response(
        `Paramerters for subscribe does not match event shape: ${result.error.message}`,
        {
          status: 400,
        }
      );
    }

    const { topic, channel } = result.data;

    return eventStream(request, (send) => {
      const handle = (data: JSONValue) => {
        send("message", { topic, channel: channel ?? "A", data });
      };

      return this.emitter.on(topic, handle);
    });
  }
}
