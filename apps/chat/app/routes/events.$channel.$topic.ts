import type { LoaderArgs } from "@remix-run/cloudflare";
import type { EVENTS } from "~/services/emitter";
import { emitter } from "~/services/emitter";

export const loader = ({ params: { channel, topic } }: LoaderArgs) => {
  if (typeof channel !== "string") {
    throw new Response("Channel must be a string", { status: 400 });
  }

  if (typeof topic !== "string") {
    throw new Response("Topic must be a string", { status: 400 });
  }

  return emitter.listen(channel, topic as EVENTS);
};
