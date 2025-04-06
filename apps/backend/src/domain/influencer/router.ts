import { Effect, Schema } from "effect";
import { liveTrpcRunner } from "../../config/live-layer";
import { publicProcedure, router } from "../../trpc/trpc";
import { InfluencerService } from "./service";

const OutputSchema = Schema.standardSchemaV1(
  Schema.Array(
    Schema.Struct({
      name: Schema.String,
      followerCount: Schema.Number,
      avgWatchtime: Schema.Number,
      avgImpressionsPerMonth: Schema.Number,
    })
  )
);

export const influencerRouter = router({
  getAll: publicProcedure
    .output(OutputSchema)
    .query(async () =>
      liveTrpcRunner(
        InfluencerService.getAll().pipe(
          Effect.flatMap(Schema.encode(OutputSchema))
        )
      )
    ),
  triggerUpdate: publicProcedure.mutation(() =>
    liveTrpcRunner(InfluencerService.fetchAndUpdateDataForAll())
  ),
});
