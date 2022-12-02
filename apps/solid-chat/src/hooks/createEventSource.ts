import { createEffect, onCleanup } from "solid-js";
import { EventTopic, Events } from "~/types/events";

export const createEventSource = (
  { topic, channel }: { channel: string; topic: EventTopic },
  onMessage: (ev: {
    data: Events[typeof topic];
    topic: EventTopic;
    channel: string;
  }) => void
) => {
  createEffect(() => {
    const eventSource = new EventSource(`/events/${channel}/${topic}`);

    eventSource.addEventListener("message", (event) => {
      const data = JSON.parse(event.data);

      onMessage(data);
    });

    onCleanup(() => eventSource.close());
  });
};
