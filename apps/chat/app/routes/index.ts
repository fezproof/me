import { redirect } from "@remix-run/cloudflare";
import { emitter } from "~/services/emitter";

export const loader = async () => {
  const roomId = await emitter.createChannel();

  return redirect(`/${roomId}`);
};
