import { Schema } from "effect";

export const SortDirectionSchemaEnums = Schema.Enums({
  asc: "asc",
  desc: "desc",
} as const);

export const LikeOperatorSchema = Schema.Literal("like");
export const BinaryOperatorSchemaEnums = Schema.Enums({
  lt: "lt",
  lte: "lte",
  eq: "eq",
  ne: "ne",
  gte: "gte",
  gt: "gt",
} as const);
