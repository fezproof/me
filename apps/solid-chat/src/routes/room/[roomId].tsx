import { createEffect, createSignal, onCleanup } from "solid-js";
import { RouteDataArgs, useParams, useRouteData } from "solid-start";
import {
  createServerAction$,
  createServerData$,
  redirect,
} from "solid-start/server";
import { createEventSource } from "~/hooks/createEventSource";
import { emitter } from "~/services/emitter";
import { Events, EventTopic } from "~/types/events";

export function routeData({ params }: RouteDataArgs) {
  return createServerData$(
    ([, roomId], {}) => {
      return { now: Date.now(), roomId };
    },
    {
      key: () => ["rooms", params.roomId],
      deferStream: true,
    }
  );
}

export default function Home() {
  const data = useRouteData<typeof routeData>();

  const { roomId } = useParams();

  const [state, setState] = createSignal({});
  createEventSource({ channel: roomId, topic: "CHANGED" }, (event) => {
    setState(event);
  });

  const [_, sendMessage] = createServerAction$(
    async (formData: FormData) => {
      const roomId = formData.get("roomId");
      const message = formData.get("message");

      if (typeof roomId !== "string") {
        throw new Response("Bad room id", { status: 400 });
      }

      if (typeof message !== "string") {
        throw new Response("Bad message", { status: 400 });
      }

      await emitter.emit(roomId, "CHANGED", { message });

      redirect(`/room/${roomId}`);
    },
    {
      invalidate: ["rooms"],
    }
  );

  return (
    <main class="mx-auto max-w-prose w-full">
      <div class="grid grid-cols-2 grid-rows-1">
        <pre>{JSON.stringify(data(), null, 2)}</pre>
        <pre>{JSON.stringify(state(), null, 2)}</pre>
      </div>

      <sendMessage.Form autocomplete="off" method="post">
        <input type="hidden" name="roomId" value={roomId} />
        <input
          type="text"
          name="message"
          class="leading-8 border border-black px-2"
        />
      </sendMessage.Form>
    </main>
  );
}
