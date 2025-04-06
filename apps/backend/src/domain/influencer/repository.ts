import { eq } from "drizzle-orm";
import { Effect } from "effect";
import { DB } from "../../db";
import { influencers } from "./schema";

export class InfluencerRepo extends Effect.Service<InfluencerRepo>()(
  "@backend/influencer/repository",
  {
    accessors: true,
    dependencies: [DB.Default],
    effect: Effect.gen(function* () {
      const db = yield* DB;

      return {
        getAll: () =>
          Effect.gen(function* () {
            return yield* db.query.influencers.findMany();
          }),

        update: (
          id: typeof influencers.$inferSelect.id,
          values: Partial<typeof influencers.$inferInsert>
        ) =>
          Effect.gen(function* () {
            return yield* db
              .update(influencers)
              .set(values)
              .where(eq(influencers.id, id));
          }),
      };
    }),
  }
) {}
