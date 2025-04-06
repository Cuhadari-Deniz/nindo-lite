import { createHTTPServer } from "@trpc/server/adapters/standalone";
import cors from "cors";
import { Duration, Effect, Schedule } from "effect";
import { Configuration } from "./config/configuration";
import { liveLayer } from "./config/live-layer";
import { InfluencerService } from "./domain/influencer/service";
import { appRouter } from "./trpc/root-router";

Effect.runPromise(
  Effect.gen(function* () {
    const server = createHTTPServer({
      middleware: cors(),
      basePath: "/api/trpc/",
      router: appRouter,
    });

    const port = yield* Configuration.SERVER_PORT;
    server.listen(port);
    console.log(`Server listening on port ${port}`);

    // trigger data fetching immediately after boot up and then every 24h
    yield* Effect.repeat(
      InfluencerService.fetchAndUpdateDataForAll(),
      Schedule.spaced(Duration.days(1))
    );
  }).pipe(Effect.provide(liveLayer))
);
