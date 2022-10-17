import { createTRPCProxyClient, httpLink } from "@trpc/client";
import type { AppRouter } from "@worker/planning";

export const planningClient = createTRPCProxyClient<AppRouter>({
  links: [
    httpLink({
      url: "http://localhost:8789",
      // @ts-ignore
      fetch: global.PLANNING?.fetch ?? fetch,
    }),
  ],
});
