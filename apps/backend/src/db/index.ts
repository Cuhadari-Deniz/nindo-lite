import { LibsqlClient } from "@effect/sql-libsql";
import { LibSQLDatabase, drizzle as libSqlDrizzle } from "drizzle-orm/libsql";
import { drizzle } from "drizzle-orm/sqlite-proxy";
import * as schema from "./schema";

import { Effect } from "effect";

import type { SqlError } from "@effect/sql/SqlError";
import { QueryPromise } from "drizzle-orm";
import { SQLiteSelectBase } from "drizzle-orm/sqlite-core";
import { Configuration } from "../config/configuration.ts";
import {
  makeRemoteCallback,
  patch,
  registerDialect,
} from "./polyfill/sql-drizzle.patch.ts";

// setup
const SqlLive = Effect.runSync(
  Configuration.DB_URL.pipe(
    Effect.provide(Configuration.Default),
    Effect.map((url) =>
      LibsqlClient.layer({
        url,
      })
    )
  )
);

export class DB extends Effect.Service<DB>()("MyDbService", {
  dependencies: [SqlLive],

  effect: Effect.gen(function* () {
    const client = yield* LibsqlClient.LibsqlClient;
    const db = drizzle(yield* makeRemoteCallback, {
      schema,
    });
    registerDialect((db as any).dialect, client);
    return db;
  }),
}) {}

let _directDb: LibSQLDatabase<typeof schema> | undefined;

export function getDirectDb() {
  const dbUrl = Effect.runSync(
    Configuration.DB_URL.pipe(Effect.provide(Configuration.Default))
  );
  if (_directDb === undefined) {
    _directDb = libSqlDrizzle({ connection: { url: dbUrl }, schema });
  }

  return _directDb;
}

export type DbType = Effect.Effect.Success<typeof DB>;

declare module "drizzle-orm" {
  export interface QueryPromise<T> extends Effect.Effect<T, SqlError> {}
}
patch(QueryPromise.prototype);
patch(SQLiteSelectBase.prototype);
