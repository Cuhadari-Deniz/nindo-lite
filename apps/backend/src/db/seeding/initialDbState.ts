import { Effect } from "effect";
import { DB } from "..";
import { influencers } from "../schema";

export const seedDbWithInitialData = Effect.gen(function* () {
  const db = yield* DB;

  yield* db.delete(influencers);

  const influencersToCreate = Array.from({ length: 30 }, (_, i) => {
    return {
      id: crypto.randomUUID(),
      name: `influencer${i + 1}`,
      externalId: `externalId-${i}`,
    };
  });

  yield* db.insert(influencers).values(influencersToCreate);
});
