import {} from "@trpc/server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "./router";

export type Environment = { DO_ROOM: DurableObjectNamespace };

export { RoomDurableObject } from "./durableObjects/RoomDurableObject";

const worker: ExportedHandler<Environment> = {
  async fetch(request, env) {
    return fetchRequestHandler({
      endpoint: "",
      req: request,
      router: appRouter,
      createContext: () => ({
        env,
      }),
    });
  },
};

export default worker;
