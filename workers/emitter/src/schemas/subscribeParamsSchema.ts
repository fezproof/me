import { z } from "zod";

export const subscribeParamsSchema = z.object({
  topic: z.string(),
  channel: z.string(),
});
