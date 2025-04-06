import { asc, desc, type AnyColumn } from "drizzle-orm";

export function getOrderByOperator<
  TField extends string,
  TOrderBy extends readonly [TField, "asc" | "desc"] | undefined
>(
  orderBy: TOrderBy,
  entityMapping: Record<TField, AnyColumn>
): undefined | ReturnType<typeof asc | typeof desc> {
  if (!orderBy) {
    return undefined;
  }

  const directionMapping = {
    asc,
    desc,
  };

  const [field, direction] = orderBy;
  return directionMapping[direction](entityMapping[field]);
}
