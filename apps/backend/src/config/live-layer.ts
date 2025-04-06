import { Cause, Effect, Either, Exit, Layer, Option } from "effect";
import { InfluencerService } from "../domain/influencer/service";
import type { ParseError } from "effect/ParseResult";
import type { SqlError } from "@effect/sql/SqlError";
import { TRPCError } from "@trpc/server";
import { InfluencerRepo } from "../domain/influencer/repository";
import { MockDataGeneratorService } from "../domain/mock-data-generator/service";
import { Configuration } from "./configuration";

export const liveLayer = Layer.mergeAll(
  Configuration.Default,
  InfluencerService.Default,
  InfluencerRepo.Default,
  MockDataGeneratorService.Default
);

type LiveLayerSuccess = Layer.Layer.Success<typeof liveLayer>;

type HandledErrors = SqlError | ParseError;

export const liveTrpcRunner = async <A>(
  effect: Effect.Effect<A, HandledErrors, LiveLayerSuccess | never>
) => {
  const exit = await Effect.runPromiseExit(
    effect.pipe(
      Effect.provide(liveLayer),

      // Default Error Handling
      // prevent leaking implementation details and provide identifier for lookup
      Effect.catchTag("ParseError", (error) => {
        const identifier = `[Error][ParseError][${crypto.randomUUID()}]`;
        console.error(`${identifier}:\n${error}`);
        return Effect.fail(
          new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            cause: "ParseError",
            message: identifier,
          })
        );
      }),
      Effect.catchTag("SqlError", (error) => {
        const identifier = `[Error][SqlError][${crypto.randomUUID()}]`;
        console.error(`${identifier}\n${error}`);
        return Effect.fail(
          new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            cause: "SqlError",
            message: identifier,
          })
        );
      })
    )
  );

  if (Exit.isFailure(exit)) {
    const eitherError = Cause.failureOrCause(exit.cause);
    const optionError = Either.getLeft(eitherError);
    const error = Option.getOrThrow(optionError);
    throw error;
  }

  return exit.value;
};
