import type { Animal } from "$lib/server/db/schema/animal.model";
import { getOperators } from "drizzle-orm";
import type { PgTableWithColumns, TableConfig } from "drizzle-orm/pg-core";
import z from "zod";
import { operators, type IOperators } from "./operators.query.schema";

type Filter<T extends Record<string, unknown>> = {
  [K in keyof T]?: {
    [O in IOperators.Id]?: T[K] | T[K][];
  };
};

const f: Filter<Animal>[] = [
  { date_of_birth: { lt: new Date() } },
  { species: { eq: "dog" } },
];

const filter_schema = <Table extends TableConfig>(
  fields: Partial<
    Record<
      keyof Table["columns"],
      {
        type: z.ZodType;
        ops: IOperators.Id[];
      }
    >
  >,
) =>
  z.array(
    z.object(
      Object.keys(fields).reduce(
        (acc, key) => {
          const { type, ops } = fields[key as keyof typeof fields] || {};
          if (!type || !ops) return acc;

          acc[key as keyof typeof fields] = field_filter(type, ops);

          return acc;
        },
        {} as Record<keyof Table["columns"], ReturnType<typeof field_filter>>,
      ),
    ),
  );

type Filter2<Table extends TableConfig> = z.infer<
  ReturnType<typeof filter_schema<Table>>
>;

// const f2: Filter2<typeof AnimalTable> = [];

export const field_filter = <Schema extends z.ZodType, O extends IOperators.Id>(
  type: Schema,
  operator_ids: O[],
) =>
  z
    .object(operators(type))
    .pick(
      operator_ids.reduce(
        (acc, curr) => {
          acc[curr] = true;
          return acc;
        },
        {} as Record<O, true>,
      ),
    )
    .partial()
    .optional();

type FieldFilter<T extends z.ZodType, O extends IOperators.Id> = z.infer<
  ReturnType<typeof field_filter<T, O>>
>;

const build_filter_schema = <
  Input extends Record<
    string,
    {
      type: z.ZodType;
      ops: IOperators.Id[];
    }
  >,
>(
  input: Input,
) => {
  const output = {} as {
    [K in keyof Input]?: ReturnType<
      typeof field_filter<Input[K]["type"], Input[K]["ops"][number]>
    >;
  };

  for (const key in input) {
    output[key] = field_filter(input[key].type, input[key].ops);
  }

  return z.object(output).partial();
};

// type Filter<
//   Input extends Record<
//     string,
//     {
//       type: z.ZodType;
//       ops: IOperators.Id[];
//     }
//   >,
// > = z.infer<ReturnType<typeof build_filter_schema<Input>>>;

// const f: Filter<{
//   age: { type: z.ZodNumber; ops: ["eq", "ne", "lte"] };
// }> = {
//   age: {
//     eq: 4,
//     lte: 5,
//   },
// };

// const build_query_schema = <
//   Input extends Record<
//     string,
//     {
//       type: z.ZodType;
//       ops: IOperators.Id[];
//     }
//   >,
// >(
//   input: Input,
// ) => {
//   const output = {} as {
//     [K in keyof Input]?: ReturnType<
//       typeof build_query_field_schema<Input[K]["type"], Input[K]["ops"][number]>
//     >;
//   };

//   for (const key in input) {
//     output[key] = build_query_field_schema(input[key].type, input[key].ops);
//   }

//   return z.object(output).partial();
// };

// const schema = build_query_schema({
//   age: { type: z.number(), ops: ["eq", "ne", "lte"] },
// });
// type Schema = z.infer<typeof schema>;
// const s: Schema = {
//   age: 4,
// };

type Condition<
  F extends string | number | symbol,
  O extends IOperators.Id = IOperators.Id,
  V extends unknown = unknown,
> = {
  f: F;
  o: O;
  v: V;
};

const filter_to_conditions = <
  Filter extends Record<string, FieldFilter<z.ZodType, IOperators.Id>>,
>(
  filter: Partial<Filter> | undefined,
) => {
  type F = keyof Filter;

  const conditions: Condition<F>[] = [];

  for (const f in filter) {
    const field_filter = filter[f];
    if (!field_filter) continue;

    for (const op in field_filter) {
      const v = field_filter[op as IOperators.Id];
      if (!v) continue;

      conditions.push({
        f: f as F,
        o: op as IOperators.Id,
        v,
      });
    }
  }

  return conditions;
};

const DRIZZLE_OPERATORS = getOperators();
// const OPERATOR_TO_DRIZZLE = {
//   eq: OPERATORS["eq"],
//   ne: OPERATORS["ne"],

//   gt: OPERATORS["gt"],
//   gte: OPERATORS["gte"],
//   lt: OPERATORS["lt"],
//   lte: OPERATORS["lte"],

//   in: OPERATORS["inArray"],
//   nin: OPERATORS["notInArray"],
// } satisfies Record<OperatorId, any>;

const condition_to_clause = <Table extends TableConfig>(
  table: PgTableWithColumns<Table>,
  { f, o, v }: Condition<keyof Table["columns"]>,
) => {
  switch (o) {
    case "eq":
    case "ne":
    case "gt":
    case "gte":
    case "lt":
    case "lte": {
      return DRIZZLE_OPERATORS[o](table[f], v);
    }

    case "in": {
      return DRIZZLE_OPERATORS.inArray(table[f], v as unknown[]);
    }

    case "nin": {
      return DRIZZLE_OPERATORS.notInArray(table[f], v as unknown[]);
    }

    default: {
      throw new Error("Unhandled condition.operator: " + o);
    }
  }
};

const conditions_to_where = <Table extends TableConfig>(
  table: PgTableWithColumns<Table>,
  conditions: Condition<keyof Table["columns"]>[],
) => {
  const clauses = conditions.map((c) => condition_to_clause(table, c));

  return DRIZZLE_OPERATORS.and(...clauses);
};

export const filter_to_where = <Table extends TableConfig>(
  table: PgTableWithColumns<Table>,
  filter:
    | Partial<
        Record<keyof Table["columns"], FieldFilter<z.ZodType, IOperators.Id>>
      >
    | undefined,
) => {
  const conditions = filter_to_conditions(filter);
  console.log("conditions", conditions);

  return conditions_to_where(table, conditions);
};
