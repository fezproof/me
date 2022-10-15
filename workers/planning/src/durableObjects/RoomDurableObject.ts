import { Router } from "itty-router";
import { Environment } from "..";
import { createRoomeStorage, RoomStorage } from "../storage";

const router = Router();

interface RouterContext {
  roomStorage: RoomStorage;
  id: string;
}

router.post("/new", async (request, { roomStorage }: RouterContext) => {
  if (await roomStorage.getRoomName()) {
    return new Response("Room already created", { status: 400 });
  }

  if (!request.json) {
    return new Response("Expected JSON input", { status: 406 });
  }

  const { name }: { name: string } = await request.json();

  await roomStorage.setRoomName(name);

  return new Response("Success", { status: 200 });
});

router.get("/", async (_, { roomStorage, id }: RouterContext) => {
  const name = await roomStorage.getRoomName();
  return new Response(JSON.stringify({ name, id }), {
    headers: {
      "content-type": "application/json",
    },
  });
});

export class RoomDurableObject implements DurableObject {
  state: DurableObjectState;

  constructor(state: DurableObjectState, env: Environment) {
    this.state = state;
  }

  fetch(request: Request): Promise<Response> {
    return router.handle(request, {
      roomStorage: createRoomeStorage(this.state.storage),
      id: this.state.id.toString(),
    });
  }
}
