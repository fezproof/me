import { Environment } from ".";

import { initTRPC } from "@trpc/server";
import { z } from "zod";

const t = initTRPC.context<{ env: Environment }>().create();

const publicProcedure = t.procedure;
const router = t.router;

const roomRouter = router({
  get: publicProcedure
    .input(z.string())
    .query(async ({ input, ctx: { env } }) => {
      const id = env.DO_ROOM.idFromString(input);
      const stub = env.DO_ROOM.get(id);

      const result = await stub.fetch("https://emitter.io/");
      return result.json<{ name: string; id: string }>();
    }),
});

export const appRouter = router({
  new: publicProcedure
    .input(z.object({ name: z.string().min(1).max(32) }))
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
  room: roomRouter,
});
