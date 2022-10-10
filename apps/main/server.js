import { createEventHandler } from "@remix-run/cloudflare-workers";
import * as build from "@remix-run/dev/server-build";

// global emitter to make it work locally
const hasGlobalEmitter = !!global.EMITTER;
const emitter = {
  fetch: async (request, requestInit) => {
    const url = new URL(request);

    if (!hasGlobalEmitter) {
      url.hostname = "localhost";
      url.port = "8788";
    }

    if (hasGlobalEmitter) {
      return global.EMITTER?.fetch(url.toString(), requestInit);
    }

    return fetch(url.toString(), requestInit);
  },
};

addEventListener("fetch", (event) => {
  const handler = createEventHandler({
    build,
    mode: process.env.NODE_ENV,
    getLoadContext: () => ({
      cf: event.request.cf,
      EMITTER: emitter,
    }),
  });

  return handler(event);
});
