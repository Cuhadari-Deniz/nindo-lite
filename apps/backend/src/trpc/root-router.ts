import { influencerRouter } from "../domain/influencer/router";
import { router } from "./trpc";

export const appRouter = router({
  influencer: influencerRouter,
});

export type AppRouter = typeof appRouter;
