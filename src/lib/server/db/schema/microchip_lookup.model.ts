import type { MicrochipLookupResult } from "$lib/services/microchip_lookup/abstract.external.service";
import { jsonb, pgEnum, pgTable, unique, varchar } from "drizzle-orm/pg-core";
import { MICROCHIP_LOOKUP } from "../../../const/microchip_lookup.const";
import type { MicrochipNumber } from "../../../schema/microchip_lookup.schema";
import { StaticSchema } from "./common/static.schema";

export const microchip_lookup_database_enum = pgEnum(
  "microchip_lookup_databases",
  MICROCHIP_LOOKUP.DATABASE.IDS,
);

export const microchip_lookup_aggregator_enum = pgEnum(
  "microchip_lookup_aggregators",
  MICROCHIP_LOOKUP.AGGREGATOR.IDS,
);

export const MicrochipLookupTable = pgTable(
  "microchip_lookup",
  {
    ...StaticSchema.id(),
    // ...DynamicSchema.org_id(),

    aggregator_id: microchip_lookup_aggregator_enum(),
    database_id: microchip_lookup_database_enum().notNull(),

    microchip_number: varchar({ length: 63 })
      .notNull()
      .$type<MicrochipNumber>(),

    // Keep these two separate (instead of a wrapping `result` field), so that it has the same shape as the service result
    data: jsonb().$type<MicrochipLookupResult["data"]>().notNull(),
    response: jsonb().$type<MicrochipLookupResult["response"]>().notNull(),

    // We'll use timestamps to check freshness
    ...StaticSchema.timestamps,
  },
  (table) => [
    unique("microchip_lookup_microchip_number_database_id_idx").on(
      table.microchip_number,
      table.database_id,
    ),
  ],
);

export type MicrochipLookup = typeof MicrochipLookupTable.$inferSelect;
