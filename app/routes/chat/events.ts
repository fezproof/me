import type { LoaderArgs } from "@remix-run/cloudflare";

export const loader = async ({ request, context }: LoaderArgs) => {
  const url = new URL(request.url);

  try {
    return context.EMITTER.fetch(`${url.origin}/chatMessageReceived`);
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message, error.name, error.stack);
    } else {
      console.error(typeof error);
    }
    throw error;
  }
};
