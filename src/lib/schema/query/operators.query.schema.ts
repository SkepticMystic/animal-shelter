import z from "zod";

type Z = z.ZodType;

const OPERATOR_IDS = [
  "eq",
  "ne",
  "gt",
  "gte",
  "lt",
  "lte",
  "in",
  "nin",
] as const;

export const OPERATORS = {
  IDS: OPERATOR_IDS,
};

export declare namespace IOperators {
  type Id = (typeof OPERATOR_IDS)[number];
}

export const operators = <T extends Z>(schema: T) => ({
  eq: schema,
  ne: schema,

  gt: schema,
  gte: schema,
  lt: schema,
  lte: schema,

  in: z
    .union([schema, z.array(schema).min(1)])
    .transform((v) => (Array.isArray(v) ? v : [v])),
  nin: z
    .union([schema, z.array(schema).min(1)])
    .transform((v) => (Array.isArray(v) ? v : [v])),
});

// const op_eq = <T extends Z>(schema: T) => z.object({ eq: schema });
// const op_ne = <T extends Z>(schema: T) => z.object({ ne: schema });

// const op_gt = <T extends Z>(schema: T) => z.object({ gt: schema });
// const op_gte = <T extends Z>(schema: T) => z.object({ gte: schema });
// const op_lt = <T extends Z>(schema: T) => z.object({ lt: schema });
// const op_lte = <T extends Z>(schema: T) => z.object({ lte: schema });

// const op_in = <T extends Z>(schema: T) =>
//   z.object({ in: z.array(schema).min(1) });
// const op_nin = <T extends Z>(schema: T) =>
//   z.object({ nin: z.array(schema).min(1) });

// export type IOperator<T extends Z> = {
//   eq: ReturnType<typeof op_eq<T>>;
//   ne: ReturnType<typeof op_ne<T>>;
//   in: ReturnType<typeof op_in<T>>;
//   nin: ReturnType<typeof op_nin<T>>;
//   gt: ReturnType<typeof op_gt<T>>;
//   gte: ReturnType<typeof op_gte<T>>;
//   lt: ReturnType<typeof op_lt<T>>;
//   lte: ReturnType<typeof op_lte<T>>;
// };

// export const Operators = {
//   eq: op_eq,
//   ne: op_ne,

//   in: op_in,
//   nin: op_nin,

//   gt: op_gt,
//   gte: op_gte,
//   lt: op_lt,
//   lte: op_lte,
// };

// type EqOperator<T extends Z> = z.infer<ReturnType<typeof op_eq<T>>>;
