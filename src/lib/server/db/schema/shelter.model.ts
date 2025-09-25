import { HTMLUtil, type IHTML } from "../../../utils/html/html.util";
import { relations } from "drizzle-orm";
import { index, jsonb, pgTable, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import z from "zod";
import {
  donation_method_schema,
  type DonationMethod,
} from "../../../schema/donation_method.schema";
import { LinkSchema, type Link } from "../../../schema/link.schema";
import { place_schema, type Place } from "../../../schema/place.schema";
import { AnimalTable } from "./animal.model";
import { OrganizationTable } from "./auth.model";
import { DynamicSchema } from "./common/dynamic.schema";
import { StaticSchema } from "./common/static.schema";
import { ImageTable } from "./image.model";

/** OrgTable is an auth construct, shelter is for publically visible metadata about the Shelter.
 * ONE SHELTER PER ORG.
 * We reserve better-auth teams for teams _within_ a shelter
 */
export const ShelterTable = pgTable(
  "shelter",
  {
    ...StaticSchema.id(),
    ...StaticSchema.short_id(),
    ...DynamicSchema.org_id(),

    name: varchar({ length: 255 }).notNull(),
    description: text().$type<IHTML.Sanitized>(),

    place: jsonb().$type<Place>(),

    urls: jsonb().$type<Link[]>().default([]).notNull(),
    phones: jsonb().$type<Link[]>().default([]).notNull(),
    emails: jsonb().$type<Link[]>().default([]).notNull(),

    // CURSED: At first I thought the final param was just the number without 0s and dashes
    // But https://www.npo.gov.za/PublicNpo/Npo/DetailsPublicDocs/51663948 has nothing to do with it's actual npo number
    // https://www.npo.gov.za/PublicNpo/Npo/DetailsPublicDocs/2950
    // Seems to be: /\d{3}-\d{3} NPO/
    npo_number: varchar({ length: 50 }),
    // pbo_number: varchar({ length: 50 }),

    donation_methods: jsonb().$type<DonationMethod[]>().default([]).notNull(),

    ...StaticSchema.timestamps,
  },
  (table) => [index("idx_shelter_org_id").on(table["org_id"])],
);

export type Shelter = typeof ShelterTable.$inferSelect;
export type InsertShelter = typeof ShelterTable.$inferInsert;

const shelter_refinements = {
  name: (s: z.ZodString) =>
    s
      .min(2, "Name must be at least 2 characters")
      .max(255, "Name must be at most 255 characters"),

  description: z
    .string()
    .trim()
    .max(2000, "Description must be at most 2000 characters")
    .transform(HTMLUtil.sanitize)
    .optional()
    .nullable(),

  place: place_schema.optional().nullable(),

  phones: z.array(LinkSchema["tel"]).max(5),
  urls: z.array(LinkSchema["https"]).max(10),
  emails: z.array(LinkSchema["mailto"]).max(5),

  donation_methods: z.array(donation_method_schema).max(5),

  npo_number: z
    .string()
    .transform((s, ctx) => {
      if (s.trim() === "") return undefined;

      const matches = s.match(/(\d{3})[- ]?(\d{3})/);
      if (!matches) {
        ctx.addIssue({
          input: s,
          continue: false,
          format: "npo_number",
          code: "invalid_format",
          message: "NPO number must be in the format 123-456",
        });

        return z.NEVER;
      } else {
        return `${matches[1]}-${matches[2]} NPO` as const;
      }
    })
    .brand("NPONumber")
    .optional()
    .nullable(),
};

const pick = {
  name: true,
  place: true,
  urls: true,
  emails: true,
  phones: true,
  description: true,
  npo_number: true,
  donation_methods: true,
} satisfies Partial<Record<keyof Shelter, true>>;

export namespace ShelterSchema {
  export const insert = createInsertSchema(
    ShelterTable,
    shelter_refinements,
  ).pick(pick);
  export const update = createUpdateSchema(
    ShelterTable,
    shelter_refinements,
  ).pick(pick);

  export type InsertIn = z.input<typeof insert>;
  export type InsertOut = z.output<typeof insert>;
  export type Update = z.input<typeof update>;
}

export const shelter_relations = relations(ShelterTable, ({ one, many }) => ({
  images: many(ImageTable),
  animals: many(AnimalTable),

  organization: one(OrganizationTable, {
    fields: [ShelterTable.org_id],
    references: [OrganizationTable.id],
  }),
}));
