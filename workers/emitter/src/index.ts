type Environment = {
  DO_EMITTER: DurableObjectNamespace;
};

export { EmitterDurableObject } from "./durableObjects/EmitterDurableObject";

const worker: ExportedHandler<Environment> = {
  async fetch(request: Request, env) {
    const id = env.DO_EMITTER.idFromName("A");
    const obj = env.DO_EMITTER.get(id);

    return obj.fetch(request);
  },
};

export default worker;
