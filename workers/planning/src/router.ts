import { Router } from "itty-router";

export type Environment = {};

const router = Router();

router.post("/new", async (_, env: Environment) => {
  return new Response("A", { status: 200 });
});

router.get("/player/list", async (_, env: Environment) => {
  return new Response("A", { status: 200 });
});

router.post("/join/:id", async (_, env: Environment) => {
  return new Response("A", { status: 200 });
});

router.get("/game/:id");

router.all("*", () => new Response("Not Found.", { status: 404 }));

export { router };
