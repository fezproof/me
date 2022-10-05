import { createEventHandler } from "@remix-run/cloudflare-workers";
import * as build from "@remix-run/dev/server-build";

const emitter = global.EMITTER ?? {
  fetch: async (request, requestInit) => {

    const origin = 'http://localhost:8788';

    return fetch(`${origin}${request}`, requestInit);
  }
}

addEventListener(
  "fetch",
  (event) => {
    const handler = createEventHandler({
      build, mode: process.env.NODE_ENV, getLoadContext: () => ({
        cf: event.request.cf,
        // eslint-disable-next-line no-undef
        EMITTER: emitter,
      })
    })

    return handler(event)
  }
);
