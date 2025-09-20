import { relations } from "drizzle-orm";
import {
  index,
  jsonb,
  pgEnum,
  pgTable,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import z from "zod";
import { IMAGES } from "../../../const/image.const";
import { RESOURCES } from "../../../const/resource.const";
import { AnimalTable } from "./animal.model";
import { AnimalEventTable } from "./animal_event.model";
import { DynamicSchema } from "./common/dynamic.schema";
import { StaticSchema } from "./common/static.schema";
import { ShelterTable } from "./shelter.model";

export const image_provider_enum = pgEnum(
  "image_providers",
  IMAGES.PROVIDER.IDS,
);

// NOTE: Use the same names as given to the drizzle.schema setup
export const image_resource_kind_enum = pgEnum(
  "image_resource_kind",
  RESOURCES.KIND.IDS,
);

export const ImageTable = pgTable(
  "image",
  {
    ...StaticSchema.id(),
    ...DynamicSchema.org_id(),

    url: varchar({ length: 2048 }).notNull(),
    provider: image_provider_enum().notNull(),
    external_id: varchar({ length: 255 }).notNull().unique(),
    /** Raw response from provider */
    response: jsonb().notNull(),

    // NOT unique! Many images for one resource
    resource_id: uuid().notNull(),
    resource_kind: image_resource_kind_enum().notNull(),

    thumbhash: varchar({ length: 100 }),

    // TODO: Lol, I don't think drizzle/pg is updating timestamps for me like mongoose does...
    ...StaticSchema.timestamps,
  },
  (table) => [
    index("idx_image_org_id").on(table["org_id"]),
    // NOTE: I could make a compound index on (resource_id, resource_kind) but
    // the id is gonna be a unique uuid
    index("idx_image_resource_id").on(table["resource_id"]),
  ],
);

export const image_relations = relations(ImageTable, ({ one }) => ({
  shelter: one(ShelterTable, {
    fields: [ImageTable.resource_id],
    references: [ShelterTable.id],
  }),

  animal: one(AnimalTable, {
    fields: [ImageTable.resource_id],
    references: [AnimalTable.id],
  }),

  animal_event: one(AnimalEventTable, {
    fields: [ImageTable.resource_id],
    references: [AnimalEventTable.id],
  }),
}));

export type Image = typeof ImageTable.$inferSelect;

const refinements = {
  url: z.url(),
  thumbhash: (s: z.ZodString) => s.nullable(),
};

const pick = {
  url: true,
  provider: true,
  external_id: true,
  resource_id: true,
  resource_kind: true,
  org_id: true,
  thumbhash: true,
} satisfies Partial<Record<keyof Image, true>>;

export namespace ImageSchema {
  export const insert = createInsertSchema(ImageTable, refinements).pick(pick);
  export const update = createUpdateSchema(ImageTable, refinements).pick(pick);

  export type Insert = z.infer<typeof insert>;
  export type Update = z.infer<typeof update>;
}
