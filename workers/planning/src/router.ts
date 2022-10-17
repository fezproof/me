import { Environment } from ".";

import { initTRPC } from "@trpc/server";
import { z } from "zod";

const t = initTRPC.context<{ env: Environment }>().create();

const publicProcedure = t.procedure;
const router = t.router;

const roomNameSchema = z.string().min(1).max(32);

const roomRouter = router({
  new: publicProcedure
    .input(z.object({ name: roomNameSchema }))
    .mutation(async ({ input, ctx: { env } }) => {
      const id = env.DO_ROOM.newUniqueId();
      const stub = env.DO_ROOM.get(id);

      const result = await stub.fetch(`https://emitter.io/new`, {
        method: "post",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(input),
      });

      if (!result.ok) {
        throw new Error("Failed to create room");
      }

      return { id: id.toString(), name: input.name };
    }),

  get: publicProcedure
    .input(z.object({ roomId: z.string() }))
    .query(async ({ input: { roomId }, ctx: { env } }) => {
      const id = env.DO_ROOM.idFromString(roomId);
      const stub = env.DO_ROOM.get(id);

      const result = await stub.fetch("https://emitter.io/");
      return result.json<{ name: string; id: string }>();
    }),

  updateRoomName: publicProcedure
    .input(roomNameSchema)
    .mutation(async ({ input: name }) => {
      return name;
    }),

  join: publicProcedure
    .input(z.object({ userId: z.string().uuid(), name: z.string() }))
    .mutation(() => {
      return [];
    }),

  leave: publicProcedure
    .input(z.object({ userId: z.string().uuid() }))
    .mutation(() => {
      return [];
    }),

  members: publicProcedure.query(async () => {
    return [];
  }),
});

export const appRouter = router({
  room: roomRouter,
});
