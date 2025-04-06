import { numeric, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const influencers = sqliteTable("influencer", {
  id: text("id").primaryKey().$defaultFn(crypto.randomUUID),
  name: text("name").notNull(),
  externalId: text("externalId").notNull().unique(),
  followerCount: numeric("followerCount", { mode: "number" })
    .notNull()
    .default(0),
  avgWatchtime: numeric("avgWatchtime", { mode: "number" })
    .notNull()
    .default(0),
  avgImpressionsPerMonth: numeric("avgImpressionsPerMonth", { mode: "number" })
    .notNull()
    .default(0),
});
