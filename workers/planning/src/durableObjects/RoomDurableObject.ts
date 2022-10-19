import { initTRPC } from "@trpc/server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { z } from "zod";
import { createRoomeStorage, RoomStorage } from "../storage";

interface Context extends Record<string, unknown> {
  roomStorage: RoomStorage;
  roomId: string;
}

const playerSchema = z.object({ id: z.string().uuid(), name: z.string() });

const t = initTRPC.context<Context>().create();

const publicProcedure = t.procedure;
const router = t.router;

const playerRouter = router({
  list: publicProcedure.query(async ({ ctx: { roomStorage } }) => {
    const playerMap = await roomStorage.getPlayerList();

    return [...playerMap.values()];
  }),
  updateStatus: publicProcedure
    .input(z.object({ userId: z.string().uuid(), online: z.boolean() }))
    .mutation(async ({ ctx: { roomStorage }, input: { userId, online } }) => {
      await roomStorage.setPlayerStatus(userId, online);
    }),
});

const roomRouter = router({
  new: publicProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ ctx: { roomStorage, roomId }, input: { name } }) => {
      if (await roomStorage.getRoomName()) {
        return new Response("Room already created", { status: 400 });
      }

      await roomStorage.setRoomName(name);

      return { name, id: roomId };
    }),
  details: publicProcedure.query(async ({ ctx: { roomId, roomStorage } }) => {
    const name = await roomStorage.getRoomName();
    return { id: roomId, name };
  }),
  join: publicProcedure
    .input(z.object({ userId: z.string().uuid(), userName: z.string() }))
    .output(z.array(playerSchema))
    .mutation(async ({ input: { userId, userName }, ctx: { roomStorage } }) => {
      await roomStorage.putPlayer(userId, userName);

      const playerMap = await roomStorage.getPlayerList();

      return [...playerMap.values()];
    }),

  leave: publicProcedure
    .input(z.object({ userId: z.string().uuid() }))
    .output(z.array(playerSchema))
    .mutation(async ({ input: { userId }, ctx: { roomStorage } }) => {
      await roomStorage.deletePlayer(userId);

      const playerMap = await roomStorage.getPlayerList();

      return [...playerMap.values()];
    }),
  player: playerRouter,
});

export class RoomDurableObject implements DurableObject {
  state: DurableObjectState;

  constructor(state: DurableObjectState) {
    this.state = state;
  }

  fetch(request: Request): Promise<Response> {
    return fetchRequestHandler({
      endpoint: "",
      req: request,
      router: roomRouter,
      createContext: () => ({
        roomId: this.state.id.toString(),
        roomStorage: createRoomeStorage(this.state.storage),
      }),
    });
  }
}

export type RoomRouter = typeof roomRouter;
