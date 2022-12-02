export type Events = {
  CHANGED: { message: string };
};

export type EventTopic = keyof Events;
