import { relations } from "drizzle-orm";
import { index, pgEnum, pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import z from "zod";
import { IMAGES } from "../../../const/image.const";
import { Schema } from "../../../server/db/schema/index.schema";
import { AnimalTable } from "./animal.model";
import { OrganizationTable } from "./auth.model";

export const image_provider_enum = pgEnum(
  "image_providers",
  IMAGES.PROVIDER.IDS,
);

export const image_resource_kind_enum = pgEnum("image_resource_kind", [
  "animal",
]);

export const ImageTable = pgTable(
  "image",
  {
    ...Schema.id(),

    url: varchar({ length: 2048 }).notNull(),
    provider: image_provider_enum().notNull(),
    external_id: varchar({ length: 255 }).notNull().unique(),

    // NOT unique! Many images for one resource
    resource_id: uuid().notNull(),
    resource_kind: image_resource_kind_enum().notNull(),

    // TODO: On org delete, also delete images from external provider
    org_id: uuid()
      .notNull()
      .references(() => OrganizationTable.id, { onDelete: "cascade" }),

    ...Schema.timestamps,
  },
  (table) => [index("idx_image_org_id").on(table["org_id"])],
);

export const image_relations = relations(ImageTable, ({ one }) => ({
  shelter: one(OrganizationTable, {
    fields: [ImageTable.org_id],
    references: [OrganizationTable.id],
  }),

  animal: one(AnimalTable, {
    fields: [ImageTable.resource_id],
    references: [AnimalTable.id],
  }),
}));

export type Image = typeof ImageTable.$inferSelect;

const refinements = {
  url: z.url(),
};

const pick = {
  url: true,
  provider: true,
  external_id: true,
  resource_id: true,
  resource_kind: true,
  org_id: true,
} satisfies Partial<Record<keyof Image, true>>;

export namespace ImageSchema {
  export const insert = createInsertSchema(ImageTable, refinements).pick(pick);
  export const update = createUpdateSchema(ImageTable, refinements).pick(pick);

  export type Insert = z.infer<typeof insert>;
  export type Update = z.infer<typeof update>;
}
