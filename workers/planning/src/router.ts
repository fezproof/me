import { initTRPC, TRPCError } from "@trpc/server";
import { z } from "zod";
import { Environment } from ".";
import { getRoomDoClient } from "./roomDoClient";

const t = initTRPC.context<{ env: Environment }>().create();

const publicProcedure = t.procedure;
const durableObjectProcedure = publicProcedure
  .input(z.object({ roomId: z.string() }))
  .use(
    t.middleware(({ input, ctx, next }) => {
      const roomId = (input as { roomId?: string }).roomId;

      if (typeof roomId !== "string") {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }

      try {
        const id = ctx.env.DO_ROOM.idFromString(roomId);
        const stub = ctx.env.DO_ROOM.get(id);

        const roomDoClient = getRoomDoClient(stub);

        return next({
          ctx: {
            roomDoClient,
          },
        });
      } catch {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }
    })
  );

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

  get: durableObjectProcedure.query(async ({ ctx: { roomDoClient } }) => {
    const { name, id } = await roomDoClient.details.query();

    if (typeof name !== "string") {
      throw new TRPCError({
        message: "Room does not exist",
        code: "NOT_FOUND",
      });
    }

    return { name, id };
  }),

  updateRoomName: publicProcedure
    .input(roomNameSchema)
    .mutation(async ({ input: name }) => {
      return name;
    }),

  join: durableObjectProcedure
    .input(z.object({ userId: z.string().uuid(), userName: z.string() }))
    .mutation(
      async ({ ctx: { roomDoClient }, input: { userId, userName } }) => {
        const players = await roomDoClient.join.mutate({ userId, userName });
        return players;
      }
    ),
  leave: durableObjectProcedure
    .input(z.object({ userId: z.string().uuid() }))
    .mutation(async ({ ctx: { roomDoClient }, input: { userId } }) => {
      const players = await roomDoClient.leave.mutate({ userId });
      return players;
    }),
  members: durableObjectProcedure.query(async ({ ctx: { roomDoClient } }) => {
    return roomDoClient.players.query();
  }),
});

export const appRouter = router({
  room: roomRouter,
});
