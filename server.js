import { createEventHandler } from "@remix-run/cloudflare-workers";
import * as build from "@remix-run/dev/server-build";

global.EMITTER = global.EMITTER ?? {
  fetch: async (request, requestInit) => {
    return fetch(`http://localhost:8788${request}`, requestInit);
  }
}


addEventListener(
  "fetch",
  (event) => {
    const handler = createEventHandler({
      build, mode: process.env.NODE_ENV, getLoadContext: () => ({
        cf: event.request.cf,
        // eslint-disable-next-line no-undef
        EMITTER: global.EMITTER,
      })
    })

    return handler(event)
  }
);
