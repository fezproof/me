import { createEventHandler } from "@remix-run/cloudflare-workers";
import * as build from "@remix-run/dev/server-build";

addEventListener(
  "fetch",
  (event) => {
    const handler = createEventHandler({
      build, mode: process.env.NODE_ENV, getLoadContext: () => ({
        cf: event.request.cf
      })
    })

    return handler(event)
  }
);
