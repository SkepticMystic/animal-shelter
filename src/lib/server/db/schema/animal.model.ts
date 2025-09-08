import { TIME } from "$lib/const/time";
import { Dates } from "$lib/utils/dates";
import {
  index,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import type z from "zod";
import { ANIMALS } from "../../../const/animal.const";
import { Schema } from "../../../server/db/schema/index.schema";
import { OrganizationTable } from "./auth.model";

export const animal_species_enum = pgEnum(
  "animal_species",
  ANIMALS.SPECIES.IDS,
);

/** Defines the table of animals in a shelter (org)
 * Each animal is associated with an organization and a member (staff)
 */
export const AnimalTable = pgTable(
  "animal",
  {
    id: uuid().primaryKey().defaultRandom(),
    ...Schema.short_id,

    bio: text().default(""),
    name: varchar({ length: 255 }).notNull(),
    species: animal_species_enum().notNull(),
    date_of_birth: timestamp({ mode: "date" }),

    org_id: varchar()
      .notNull()
      .references(() => OrganizationTable.id, { onDelete: "cascade" }),

    ...Schema.timestamps,
  },
  (table) => [index("idx_animal_org_id").on(table["org_id"])],
);

export type Animal = typeof AnimalTable.$inferSelect;

const refinements = {
  name: (s: z.ZodString) => s.min(2).max(255),
  bio: (s: z.ZodString) => s.max(1000),
  date_of_birth: (s: z.ZodDate) =>
    s //
      .min(Dates.add_ms(-65 * TIME.YEAR)) //
      .max(new Date()),
};

const pick = {
  bio: true,
  name: true,
  species: true,
  date_of_birth: true,
} satisfies Partial<Record<keyof Animal, true>>;

export namespace AnimalSchema {
  export const insert = createInsertSchema(AnimalTable, refinements).pick(pick);
  export const update = createUpdateSchema(AnimalTable, refinements).pick(pick);

  export type Insert = z.infer<typeof insert>;
  export type Update = z.infer<typeof update>;
}
