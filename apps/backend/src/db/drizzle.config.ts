import "./polyfill/compression.polyfill";
import { Effect } from "effect";
import { defineConfig } from "drizzle-kit";
import { Configuration } from "../config/configuration";

const dbUrl = Effect.runSync(
  Configuration.DB_URL.pipe(Effect.provide(Configuration.Default))
);

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema.ts",
  dialect: "turso",
  dbCredentials: {
    url: dbUrl,
  },
});
