import { APIEvent } from "solid-start";
import { emitter } from "~/services/emitter";

export async function GET({ params: { channel, topic } }: APIEvent) {
  return emitter.listen(channel, topic as any);
}
