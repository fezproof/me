/// <reference types="@remix-run/dev" />
/// <reference types="@remix-run/cloudflare" />
/// <reference types="@cloudflare/workers-types" />

import "@remix-run/cloudflare";
declare module "@remix-run/cloudflare" {
  interface AppLoadContext {
    cf: IncomingRequestCfProperties;
    EMITTER: {
      fetch: (url: string, requestInit?: RequestInit) => Promise<Response>;
    };
  }
}
