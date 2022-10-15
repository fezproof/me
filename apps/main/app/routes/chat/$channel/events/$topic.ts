import type { LoaderArgs } from "@remix-run/cloudflare";

export const loader = async ({ request, context, params }: LoaderArgs) => {
  const url = new URL(request.url);

  return context.EMITTER.fetch(
    `${url.origin}/subscribe/${params.channel}?topic=${params.topic}`
  );
};
