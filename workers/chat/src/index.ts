import { router } from "./router";

export type Environment = {};

const worker: ExportedHandler<Environment> = {
  async fetch(...args) {
    return router.handle(...args);
  },
};

export default worker;
