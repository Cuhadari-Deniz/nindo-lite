import { Effect, Schedule, Schema } from "effect";
import { ParseError } from "effect/ParseResult";
import {
  InfluencerDataExternal,
  MockDataGeneratorService,
  RandomGeneratorError,
} from "../mock-data-generator/service";
import { InfluencerRepo } from "./repository";

export class InfluencerService extends Effect.Service<InfluencerService>()(
  "@backend/influencer/service",
  {
    accessors: true,

    sync: () => ({
      getAll,
      fetchAndUpdateDataForAll,
    }),
  }
) {}

function getAll() {
  return Effect.gen(function* () {
    return yield* InfluencerRepo.getAll();
  });
}

function fetchAndUpdateDataForAll() {
  return Effect.gen(function* () {
    // for simplicity sake we ignore the fact that fetching all influencers is a bad idea
    const influencers = yield* InfluencerRepo.getAll();

    yield* Effect.forEach(influencers, (influencer) =>
      MockDataGeneratorService.fetchMockDataForInfluencer(
        influencer.externalId
      ).pipe(
        // retry 3 times with exponential backoff
        Effect.retry({
          times: 3,
          schedule: Schedule.exponential("100 millis"),
        }),

        Effect.flatMap((res) =>
          Effect.gen(function* () {
            const updateValues = yield* Schema.decode(
              InfluencerUpdateDataFromExternal
            )(res);

            yield* InfluencerRepo.update(influencer.id, updateValues);
          })
        ),

        Effect.catchTag(
          "ParseError",
          handleFetchMockDataForInfluencerParseError
        ),
        Effect.catchTag(
          "RandomGeneratorError",
          handleFetchMockDataForInfluencerRandomGeneratorError
        )
      )
    );
  });
}

/**
 * Possible Reasons for this error:
 * 1) Developer messed up schema or other code
 * 2) The "third-party-api" changed its specification and its response
 *
 * If these errors are unacceptable then possible handling could look like this in pseudocode:
 *
 * ```
 * if (isProduction) {
 *   yield* notifyAdminAboutCriticalFailure(error);
 *   return yield* recoverMethod(someParams);
 * } else {
 *   return Effect.die("Critical Implementation Error!");
 * }
 * ```
 *
 * But in our case we know that there is no harm done at this stage
 * and we can just let the ParseError bubble up until it's handled
 * via the liveTrpcRunner
 */
function handleFetchMockDataForInfluencerParseError(error: ParseError) {
  return Effect.fail(error);
}

/**
 * let's just say that resolving this error
 * means logging it and skipping the update for that influencer
 */
function handleFetchMockDataForInfluencerRandomGeneratorError(
  error: RandomGeneratorError
) {
  console.error(error);
  return Effect.succeed(undefined);
}

const InfluencerDataInternal = Schema.Struct({
  externalId: Schema.String,
  followerCount: Schema.Number,
  avgWatchtime: Schema.Number,
  avgImpressionsPerMonth: Schema.Number,
});

const InfluencerUpdateDataFromExternal = Schema.transform(
  InfluencerDataExternal,
  InfluencerDataInternal,
  {
    decode: (item) => ({
      externalId: item.externalInfluencerId,
      followerCount: item.totalFollower,
      avgWatchtime: item.avgWatchtime,
      avgImpressionsPerMonth: item.avgImpressionsPerMonth,
    }),
    encode: (item) => ({
      externalInfluencerId: item.externalId,
      totalFollower: item.followerCount,
      avgWatchtime: item.avgWatchtime,
      avgImpressionsPerMonth: item.avgImpressionsPerMonth,
    }),
  }
);
