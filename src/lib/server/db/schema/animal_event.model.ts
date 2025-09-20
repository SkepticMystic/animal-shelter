import { relations, sql } from "drizzle-orm";
import {
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import z from "zod";
import { animal_event_data_schema } from "../../../schema/animal_event.schema";
import { AnimalTable } from "./animal.model";
import { MemberTable, OrganizationTable } from "./auth.model";
import { DynamicSchema } from "./common/dynamic.schema";
import { StaticSchema } from "./common/static.schema";
import { ImageTable } from "./image.model";

// NOTE: Alot of fields are nullable
// We'd rather capture something than nothing
export const AnimalEventTable = pgTable(
  "animal_events",
  {
    ...StaticSchema.id(),

    ...DynamicSchema.org_id(),
    ...DynamicSchema.animal_id(),

    created_by_member_id: DynamicSchema.member_id().member_id,

    // To capture when the administrator is not a member
    administered_by_name: varchar({ length: 255 }),
    administered_by_member_id: uuid() //
      .references(() => MemberTable.id, { onDelete: "set null" }),

    notes: text().default("").notNull(),
    timestamp: timestamp({ mode: "date" }),
    data: jsonb().$type<z.infer<typeof animal_event_data_schema>>().notNull(),

    ...StaticSchema.timestamps,
  },
  (table) => [
    index("idx_animal_events_org_id").on(table.org_id),
    index("idx_animal_events_animal_id").on(table.animal_id),
    index("idx_animal_events_timestamp").on(table.timestamp),
    index("idx_animal_events_data_kind").on(sql`(data->>'kind')`),
  ],
);

export const animal_event_relations = relations(
  AnimalEventTable,
  ({ one, many }) => ({
    organization: one(OrganizationTable, {
      fields: [AnimalEventTable.org_id],
      references: [OrganizationTable.id],
    }),

    creator: one(MemberTable, {
      fields: [AnimalEventTable.created_by_member_id],
      references: [MemberTable.id],
      relationName: "animal_event_creator",
    }),

    administrator: one(MemberTable, {
      fields: [AnimalEventTable.administered_by_member_id],
      references: [MemberTable.id],
      relationName: "animal_event_administrator",
    }),

    animal: one(AnimalTable, {
      fields: [AnimalEventTable.animal_id],
      references: [AnimalTable.id],
    }),

    images: many(ImageTable),
  }),
);

export type AnimalEvent = typeof AnimalEventTable.$inferSelect;

const refinements = {
  data: animal_event_data_schema,
  // NOTE: We coerce from date when decoding MicrcochipLookup.data.animal_event.timestamp
  timestamp: z.coerce.date().optional().nullable(),

  notes: (s: z.ZodString) =>
    s.max(2000, "Notes must be at most 2000 characters"),
};

const pick = {
  data: true,
  notes: true,
  animal_id: true,
  timestamp: true,
  administered_by_name: true,
  administered_by_member_id: true,
} satisfies Partial<Record<keyof AnimalEvent, true>>;

export namespace AnimalEventSchema {
  export const insert = createInsertSchema(AnimalEventTable, refinements).pick(
    pick,
  );

  export const update = createUpdateSchema(AnimalEventTable, refinements).pick(
    pick,
  );

  export type InsertIn = z.input<typeof insert>;
  export type InsertOut = z.output<typeof insert>;
  export type UpdateIn = z.input<typeof update>;
  export type UpdateOut = z.output<typeof update>;
}
