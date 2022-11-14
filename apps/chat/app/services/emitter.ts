import { createNanoEvents } from "nanoevents";
import type { JSONValue } from "~/types/Json";

export enum EVENTS {
  CHANGED = "CHANGED",
}

type Emitter = Record<EVENTS, (data: { message: string }) => void>;

export const emitter2 = createNanoEvents<Emitter>();

interface EventsMap<T extends JSONValue = any> {
  [event: string]: (data: T) => void;
}

interface DefaultEvents extends EventsMap {
  [event: string]: (data: JSONValue) => void;
}

export interface Unsubscribe {
  (): void;
}

// @ts-ignore
const EMITTER = global.EMITTER;
const hasGlobalEmitter = !!EMITTER;

const doEmitterFetch: typeof fetch = async (request, requestInit) => {
  if (hasGlobalEmitter) {
    return EMITTER.fetch(request, requestInit);
  }

  return fetch(request, requestInit);
};

const createEmitterClient = <E extends EventsMap = DefaultEvents>() => {
  const url = new URL("https://emitter.io");

  if (!hasGlobalEmitter) {
    url.hostname = "localhost";
    url.port = "8788";
    url.protocol = "http:";
  }

  return {
    listen: <K extends keyof E>(channel: string, topic: K) => {
      return doEmitterFetch(
        `${url.origin}/subscribe/${channel}?topic=${topic as string}`
      );
    },

    emit: async <K extends keyof E>(
      channel: string,
      topic: K,
      ...data: Parameters<E[K]>
    ): Promise<void> => {
      await doEmitterFetch(`${url.origin}/send`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          data,
          topic,
          channel: channel,
        }),
      });
    },

    createChannel: async () => {
      const result = await doEmitterFetch(`${url.origin}/channel/new`);

      if (!result.ok) {
        throw new Error("Failed to create channel");
      }

      return await result.text();
    },
  };
};

export const emitter = createEmitterClient<Emitter>();
