import type { ActionArgs } from "@remix-run/cloudflare";
import { planningClient } from "~/clients/planningClient";

export const action = async ({ params }: ActionArgs) => {
  console.log("KICK", params);
  const { roomId, userId } = params;
  if (typeof roomId !== "string" || typeof userId !== "string") {
    return new Response("Bad params", { status: 406 });
  }

  await planningClient.room.leave.mutate({ roomId, userId });

  return new Response("ok", { status: 200 });
};
