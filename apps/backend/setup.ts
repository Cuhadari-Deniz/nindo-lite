/**
 * Basic Setup Script - no error handling
 */

import { Effect } from "effect";
import { seedDbWithInitialData } from "./src/db/seeding/initialDbState";
import { DB } from "./src/db";

console.log("🔄 Seeding Database ...");
await Effect.runPromise(seedDbWithInitialData.pipe(Effect.provide(DB.Default)));
console.log("✅ Database seeded successfully!");
