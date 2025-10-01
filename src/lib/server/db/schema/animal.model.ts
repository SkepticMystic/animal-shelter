import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import z from "zod";
import { ANIMALS } from "../../../const/animal.const";
import { TIME } from "../../../const/time";
import {
  microchip_number_schema,
  type MicrochipNumber,
} from "../../../schema/microchip_lookup.schema";
import { Dates } from "../../../utils/dates";
import { HTMLUtil, type IHTML } from "../../../utils/html/html.util";
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

export const animal_status_enum = pgEnum("animal_status", ANIMALS.STATUS.IDS);

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
    description: text().$type<IHTML.Sanitized>(),

    sterilised: boolean(),
    status: animal_status_enum().default("available").notNull(),

    intake_date: timestamp({ mode: "date" }),
    date_of_birth: timestamp({ mode: "date" }),

    breed: varchar({ length: 255 }),
    species: animal_species_enum().notNull(),
    gender: animal_gender_enum().default("u").notNull(),
    // color: varchar({ length: 255 }),

    traits: jsonb()
      .$type<(typeof ANIMALS.TRAITS.IDS)[number][]>()
      .default([])
      .notNull(),

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

  description: z
    .string()
    .trim()
    .max(1000, "Description must be at most 1000 characters")
    .transform(HTMLUtil.sanitize)
    .optional()
    .nullable(),

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

  traits: z
    .enum(ANIMALS.TRAITS.IDS)
    .array()
    .refine((traits) => new Set(traits).size === traits.length, {
      message: "Traits must be unique",
    })
    .refine(
      (traits) => {
        for (const trait of traits) {
          const [group, value] = trait.split(":");
          if (!value) continue;

          const has_other_in_group = traits.some(
            (t) => t !== trait && t.startsWith(group + ":"),
          );
          if (has_other_in_group) return false;
        }

        return true;
      },
      {
        message:
          "Cannot have multiple traits from the same group (e.g. High energy & Low energy)",
      },
    )
    .default([]),
};

const pick = {
  name: true,
  breed: true,
  status: true,
  traits: true,
  gender: true,
  species: true,
  sterilised: true,
  description: true,
  intake_date: true,
  date_of_birth: true,
  microchip_number: true,
} satisfies Partial<Record<keyof Animal, true>>;

export namespace AnimalSchema {
  export const insert = createInsertSchema(AnimalTable, refinements).pick(pick);
  export const update = createUpdateSchema(AnimalTable, refinements).pick(pick);

  export type InsertIn = z.input<typeof insert>;
  export type InsertOut = z.output<typeof insert>;
  export type UpdateIn = z.input<typeof update>;
  export type UpdateOut = z.output<typeof update>;
}
