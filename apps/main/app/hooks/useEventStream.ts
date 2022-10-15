import { useEffect, useState } from "react";

export interface Message<T> {
  data: T;
  topic: string;
  channel: string;
}

interface UseEventStreamOptions<T> {
  onMessage: (message: Message<T>) => void;
}

export const useEventStream = <T>(
  href: string,
  { onMessage }: UseEventStreamOptions<T>
) => {
  const [eventSource, setEventSource] = useState<EventSource>();
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setIsConnected(false);
    const eventSource = new EventSource(href);

    setEventSource(eventSource);

    eventSource.addEventListener("open", () => {
      setIsLoading(false);
      setIsConnected(true);
    });

    return () => {
      eventSource.close();
    };
  }, [href]);

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      const message = JSON.parse(event.data) as Message<T>;

      onMessage(message);
    };

    console.log("listen");

    eventSource?.addEventListener("message", handler);

    return () => {
      eventSource?.removeEventListener("message", handler);
    };
  }, [eventSource, onMessage]);

  return {
    isConnected,
    isLoading,
  };
};
