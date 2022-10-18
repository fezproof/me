import { createTRPCProxyClient, httpLink, loggerLink } from "@trpc/client";
import type { AppRouter } from "@worker/planning";

// @ts-ignore
const BINDING = global.PLANNING;
const hasGlobalEmitter = !!BINDING;

const serviceBindingFetch: typeof fetch = async (request, requestInit) => {
  if (hasGlobalEmitter) {
    return BINDING?.fetch(request, requestInit);
  }

  return fetch(request, requestInit);
};

export const planningClient = createTRPCProxyClient<AppRouter>({
  links: [
    loggerLink(),
    httpLink({
      url: hasGlobalEmitter ? "https://bench.codes" : "http://localhost:8789",
      fetch: serviceBindingFetch,
    }),
  ],
});
