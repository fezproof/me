import { useEffect, useState } from "react";
import type { EVENTS } from "~/services/emitter";

import type { JSONValue } from "~/types/Json";

export const useEventSource = (channel: string, topic: EVENTS) => {
  const [data, setData] = useState<JSONValue>();

  useEffect(() => {
    const eventSource = new EventSource(`events/${channel}/${topic}`);

    const handler = (event: MessageEvent<string>) => {
      setData(JSON.parse(event.data));
    };
    eventSource.addEventListener("message", handler);

    return () => {
      eventSource.removeEventListener("message", handler);
      eventSource.close();
    };
  }, [channel, topic]);

  return data;
};
