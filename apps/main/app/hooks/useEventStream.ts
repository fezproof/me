import { useEffect, useState } from "react";

export const useEventStream = <T>(href: string) => {
  const [data, setData] = useState<T[]>([]);

  useEffect(() => {
    const eventSource = new EventSource(href);

    const handler = (event: MessageEvent) => {
      const { data } = JSON.parse(event.data) as {
        data: unknown;
        topic: string;
        channel: string;
      };

      setData((previous) => [...previous, data as T]);
    };

    eventSource.addEventListener("message", handler);

    return () => {
      eventSource.removeEventListener("message", handler);
    };
  }, [href]);

  return { allMessages: data, latestMessage: data.at(-1) };
};
