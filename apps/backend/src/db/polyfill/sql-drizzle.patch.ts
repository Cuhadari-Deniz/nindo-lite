/**
 * Self Modified Version of @effect/sql-drizzle
 * 
 * SOURCE: https://github.com/Effect-TS/effect/blob/main/packages/sql-drizzle/src/internal/patch.ts
 * path: packages/sql-drizzle/src/internal/patch.ts
 *
 * The patch they provided did not work for drizzle queryBuilders
 *
 * I will create a PR for that once I've written a generic solution and not just this tailored one
 * 
 */

import { LibsqlClient } from "@effect/sql-libsql";
import { SqlError } from "@effect/sql/SqlError";
import type { Statement } from "@effect/sql/Statement";
import type { QueryPromise } from "drizzle-orm/query-promise";
import * as DUtils from "drizzle-orm/utils";
import * as Effect from "effect/Effect";
import * as Effectable from "effect/Effectable";
import { globalValue } from "effect/GlobalValue";
import * as Runtime from "effect/Runtime";

const clientRegistry = globalValue(
  "@effect/sql-drizzle/clientRegistry",
  () => new WeakMap<any, LibsqlClient.LibsqlClient>()
);

/** @internal */
export const registerDialect = (
  dialect: unknown,
  client: LibsqlClient.LibsqlClient
) => {
  clientRegistry.set(dialect, client);
};

const mapResultRow = (DUtils as any).mapResultRow;

const PatchProto = {
  ...Effectable.CommitPrototype,
  commit(
    this: QueryPromise<unknown> & {
      readonly prepare: () => any;
      readonly dialect: any;
      readonly toSQL: () => { sql: string; params: Array<any> };
    }
  ) {
    const client = clientRegistry.get(this.dialect);
    if (client === undefined) {
      return Effect.tryPromise({
        try: () => this.execute(),
        catch: (cause) =>
          new SqlError({ cause, message: "Failed to execute QueryPromise" }),
      });
    }
    const prepared = this.prepare();
    let statement: Statement<any>;
    if ("query" in prepared) {
      statement = client.unsafe(prepared.query.sql, prepared.query.params);
    } else if ("queryString" in prepared) {
      statement = client.unsafe(prepared.queryString, prepared.params);
    } else {
      const { params, sql } = this.toSQL();
      statement = client.unsafe(sql, params);
    }

    return Effect.map(statement.values, (rows) => {
      if (prepared.customResultMapper) {
        return prepared.customResultMapper(
          rows as unknown[][],
          normalizeFieldValue
        );
      }

      return rows.map((row) =>
        mapResultRow(prepared.fields, row, prepared.joinsNotNullableMap)
      );
    });
  },
};

function normalizeFieldValue(value: unknown) {
  if (typeof ArrayBuffer !== "undefined" && value instanceof ArrayBuffer) {
    // eslint-disable-line no-instanceof/no-instanceof
    if (typeof Buffer !== "undefined") {
      if (!(value instanceof Buffer)) {
        // eslint-disable-line no-instanceof/no-instanceof
        return Buffer.from(value);
      }
      return value;
    }
    if (typeof TextDecoder !== "undefined") {
      return new TextDecoder().decode(value);
    }
    throw new Error(
      "TextDecoder is not available. Please provide either Buffer or TextDecoder polyfill."
    );
  }
  return value;
}

/** @internal */
export const patch = (prototype: any) => {
  if (Effect.EffectTypeId in prototype) {
    return;
  }
  Object.assign(prototype, PatchProto);
};

/** @internal */
export const makeRemoteCallback = Effect.gen(function* () {
  const client = yield* LibsqlClient.LibsqlClient;
  const runtime = yield* Effect.runtime<never>();
  const runPromise = Runtime.runPromise(runtime);
  return (
    sql: string,
    params: Array<any>,
    method: "all" | "execute" | "get" | "values" | "run"
  ) => {
    const statement = client.unsafe(sql, params);
    let effect: Effect.Effect<any, SqlError> =
      method === "all" || method === "values"
        ? statement.values
        : statement.withoutTransform;
    if (method === "get") {
      effect = Effect.map(effect, (rows) => rows[0] ?? []);
    }
    return runPromise(Effect.map(effect, (rows) => ({ rows })));
  };
});
