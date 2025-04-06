import { Data, Effect, Schema } from "effect";

export class RandomGeneratorError extends Data.TaggedError(
  "RandomGeneratorError"
)<{
  message: string;
}> {}

export const InfluencerDataExternal = Schema.Struct({
  externalInfluencerId: Schema.String,
  totalFollower: Schema.Number,
  avgWatchtime: Schema.Number,
  avgImpressionsPerMonth: Schema.Number,
});

export class MockDataGeneratorService extends Effect.Service<MockDataGeneratorService>()(
  "@nindo-lite/mock-data-generator/service",
  {
    accessors: true,

    effect: Effect.gen(function* () {
      return {
        fetchMockDataForInfluencer: (externalInfluencerId: string) =>
          Effect.gen(function* () {
            // 5% chance to throw an error
            const shouldThrowRandomError = Math.random() <= 0.05;

            if (shouldThrowRandomError) {
              yield* new RandomGeneratorError({
                message: "Oh noo...",
              });
            }

            const influencerData: Schema.Schema.Type<
              typeof InfluencerDataExternal
            > = {
              externalInfluencerId,
              totalFollower: Math.floor(Math.random() * 10000),
              avgWatchtime: Math.random(),
              avgImpressionsPerMonth: Math.floor(Math.random() * 5000000),
            };
            return influencerData;
          }),
      };
    }),
  }
) {}
