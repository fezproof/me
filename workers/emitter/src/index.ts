import { router } from "./router";

export type Environment = {
  DO_EMITTER: DurableObjectNamespace;
};

export { EmitterDurableObject } from "./durableObjects/EmitterDurableObject";

const worker: ExportedHandler<Environment> = {
  async fetch(...args) {
    return router.handle(...args);
  },
};

export default worker;
