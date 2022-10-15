import { createTRPCProxyClient, httpLink } from "@trpc/client";
import type { AppRouter } from "@worker/planning";

export const getPlanningClient = (serviceFetch: typeof fetch) => {
  return createTRPCProxyClient<AppRouter>({
    links: [
      httpLink({
        url: "http://localhost:8789",
        fetch: serviceFetch,
      }),
    ],
  });
};
