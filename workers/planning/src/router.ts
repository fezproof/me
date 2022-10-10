import { Router } from "itty-router";

const router = Router();

router.all("*", () => new Response("Not Found.", { status: 404 }));

export { router };
