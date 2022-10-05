import { useEffect, useState } from "react";

export const useEventStream = (href: string) => {
  const [data, setData] = useState<string[]>([]);

  useEffect(() => {
    const eventSource = new EventSource(href);

    const handler = (event: MessageEvent) => {
      console.log(event);
      setData((previous) => [...previous, event.data || "unknown"]);
    };

    eventSource.addEventListener("message", handler);

    return () => {
      eventSource.removeEventListener("message", handler);
    };
  }, [href]);

  return { allMessages: data, latestMessage: data.at(-1) };
};
