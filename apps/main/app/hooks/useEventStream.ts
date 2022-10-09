import { useEffect, useState } from "react";

export const useEventStream = (href: string) => {
  const [data, setData] = useState<string[]>([]);

  useEffect(() => {
    const eventSource = new EventSource(href);

    const handler = (event: MessageEvent) => {
      const { topic, channel, data } = JSON.parse(event.data) as {
        data: unknown;
        topic: string;
        channel: string;
      };

      console.log(topic, channel);

      setData((previous) => [...previous, (data as string) || "unknown"]);
    };

    eventSource.addEventListener("message", handler);

    return () => {
      eventSource.removeEventListener("message", handler);
    };
  }, [href]);

  return { allMessages: data, latestMessage: data.at(-1) };
};
