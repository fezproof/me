import { z } from "zod";

export const receiveEventSchema = z.object({
  data: z.any(),
  topic: z.string(),
  channel: z.string(),
});
