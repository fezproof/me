import type { LoaderArgs } from "@remix-run/cloudflare";

export const loader = ({ request, context }: LoaderArgs) => {
  return context.EMITTER.fetch("/chatMessageReceived");
};
