import { relations } from "drizzle-orm";
import {
  index,
  pgEnum,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import type z from "zod";
import { ANIMALS } from "../../../const/animal.const";
import { TIME } from "../../../const/time";
import {
  microchip_number_schema,
  type MicrochipNumber,
} from "../../../schema/microchip_lookup.schema";
import { Dates } from "../../../utils/dates";
import { AnimalEventTable } from "./animal_event.model";
import { OrganizationTable } from "./auth.model";
import { DynamicSchema } from "./common/dynamic.schema";
import { StaticSchema } from "./common/static.schema";
import { ImageTable } from "./image.model";
import { ShelterTable } from "./shelter.model";

export const animal_species_enum = pgEnum(
  "animal_species",
  ANIMALS.SPECIES.IDS,
);

export const animal_gender_enum = pgEnum("animal_gender", ANIMALS.GENDER.IDS);

/** Defines the table of animals in a shelter (org)
 * Each animal is associated with an organization and a member (staff)
 */
export const AnimalTable = pgTable(
  "animal",
  {
    ...StaticSchema.id(),
    ...StaticSchema.short_id(),
    ...DynamicSchema.org_id(),

    /** Can either be set on the Animal form, then used to populate other fields,
     * Or can be set after adding a microchip animal_event afterwards
     */
    microchip_number: varchar({ length: 63 }).$type<MicrochipNumber | null>(),

    name: varchar({ length: 255 }).notNull(),
    description: text().default("").notNull(),

    intake_date: timestamp({ mode: "date" }),
    date_of_birth: timestamp({ mode: "date" }),

    breed: varchar({ length: 255 }),
    species: animal_species_enum().notNull(),
    gender: animal_gender_enum().default("u").notNull(),
    // color: varchar({ length: 255 }),

    ...StaticSchema.timestamps,
  },
  (table) => [index("idx_animal_org_id").on(table["org_id"])],
);

export const animal_relations = relations(AnimalTable, ({ one, many }) => ({
  organization: one(OrganizationTable, {
    fields: [AnimalTable.org_id],
    references: [OrganizationTable.id],
  }),

  shelter: one(ShelterTable, {
    fields: [AnimalTable.org_id],
    references: [ShelterTable.org_id],
  }),

  images: many(ImageTable),
  events: many(AnimalEventTable),
}));

export type Animal = typeof AnimalTable.$inferSelect;

const refinements = {
  microchip_number: microchip_number_schema.optional().nullable(),

  description: (s: z.ZodString) =>
    s.max(1000, "Bio must be at most 1000 characters"),

  name: (s: z.ZodString) =>
    s
      .min(2, "Name must be atleast 2 characters")
      .max(255, "Name must be at most 255 characters"),

  date_of_birth: (s: z.ZodDate) =>
    s //
      .min(Dates.add_ms(-65 * TIME.YEAR)) //
      .max(new Date())
      .optional(),

  intake_date: (s: z.ZodDate) =>
    s //
      .min(Dates.add_ms(-65 * TIME.YEAR)) //
      .max(new Date())
      .optional(),
};

const pick = {
  name: true,
  gender: true,
  species: true,
  breed: true,
  description: true,
  intake_date: true,
  date_of_birth: true,
  microchip_number: true,
} satisfies Partial<Record<keyof Animal, true>>;

export namespace AnimalSchema {
  export const insert = createInsertSchema(AnimalTable, refinements).pick(pick);
  export const update = createUpdateSchema(AnimalTable, refinements).pick(pick);

  export type Insert = z.infer<typeof insert>;
  export type Update = z.infer<typeof update>;
}
