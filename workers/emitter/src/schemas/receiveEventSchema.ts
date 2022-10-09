import { z } from "zod";

export const receiveEventSchema = z.object({
  data: z.string(),
  topic: z.string(),
  channel: z.string(),
});
