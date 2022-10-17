import { createEventHandler } from "@remix-run/cloudflare-workers";
import * as build from "@remix-run/dev/server-build";

const createServiceBindingShim = (BINDING, port) => {
  return {
    fetch: async (request, requestInit) => {
      const hasGlobalEmitter = !!BINDING;
      const url = new URL(request);

      if (!hasGlobalEmitter) {
        url.hostname = "localhost";
        url.port = port;
      }

      if (hasGlobalEmitter) {
        return BINDING?.fetch(url.toString(), requestInit);
      }

      return fetch(url.toString(), requestInit);
    },
  };
}

addEventListener("fetch", (event) => {
  const handler = createEventHandler({
    build,
    mode: process.env.NODE_ENV,
    getLoadContext: () => ({
      cf: event.request.cf,
      EMITTER: createServiceBindingShim(global.EMITTER, '8788'),
    }),
  });

  return handler(event);
});
