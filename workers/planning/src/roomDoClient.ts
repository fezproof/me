import { createTRPCProxyClient, httpLink, loggerLink } from "@trpc/client";
import { RoomRouter } from "./durableObjects/RoomDurableObject";

export const getRoomDoClient = (stub: DurableObjectStub) =>
  createTRPCProxyClient<RoomRouter>({
    links: [
      loggerLink(),
      httpLink({
        url: "https://room.object",
        fetch: (...args) => stub.fetch(...args),
      }),
    ],
  });
