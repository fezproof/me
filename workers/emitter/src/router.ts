import { Router } from "itty-router";
import type { Environment } from ".";
import { receiveEventSchema } from "./schemas/receiveEventSchema";
import { subscribeParamsSchema } from "./schemas/subscribeParamsSchema";

const router = Router();

router.get(
  "/subscribe/:channel",
  async ({ query, params }, env: Environment) => {
    const parsedParams = subscribeParamsSchema.safeParse({
      topic: query?.topic,
      channel: params?.channel,
    });

    if (!parsedParams.success) {
      return new Response(
        `Paramerters for subscribe does not match event shape: ${parsedParams.error.message}`,
        {
          status: 400,
        }
      );
    }
    const { topic, channel } = parsedParams.data;

    console.log("SUBSCRIBE: ", { topic, channel });

    const id = env.DO_EMITTER.idFromName(channel);
    const obj = env.DO_EMITTER.get(id);

    return obj.fetch(`https://emitter.io/?topic=${topic}&channel=${channel}`);
  }
);

router.post("/send", async (request, env: Environment) => {
  if (!request.json) {
    return new Response("Expected json input", {
      status: 400,
    });
  }
  const result = await request.json();

  const parsedResult = receiveEventSchema.safeParse(result);

  if (!parsedResult.success) {
    return new Response(
      `Body for send does not match shape: ${parsedResult.error.message}`,
      {
        status: 400,
      }
    );
  }

  const { channel, data, topic } = parsedResult.data;

  console.log("SEND: ", { topic, channel, data });

  const id = env.DO_EMITTER.idFromName(channel);
  const obj = env.DO_EMITTER.get(id);

  return obj.fetch(`https://emitter.io/`, {
    body: JSON.stringify({ channel, data, topic }),
    headers: {
      "content-type": "application/json",
    },
    method: "POST",
  });
});

router.all("*", () => new Response("Not Found.", { status: 404 }));

export { router };
