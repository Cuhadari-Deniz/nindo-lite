import { Config, Effect } from "effect";

export class Configuration extends Effect.Service<Configuration>()(
  "@nindo-lite/Config",
  {
    accessors: true,
    sync: () => ({
      SERVER_PORT: Config.number("SERVER_PORT").pipe(Config.withDefault(5588)),
      
      DB_URL: Config.string("DB_URL").pipe(
        Config.withDefault("file:./resources/myDatabase.libsql")
      ),
    }),
  }
) {}
