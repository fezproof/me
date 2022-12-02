import { redirect } from "solid-start";
import { emitter } from "~/services/emitter";

export async function GET() {
  const roomId = await emitter.createChannel();

  return redirect(`/room/${roomId}`);
}
