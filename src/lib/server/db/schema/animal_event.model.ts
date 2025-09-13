import { relations, sql } from "drizzle-orm";
import { index, jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import z from "zod";
import { animal_event_data_schema } from "../../../schema/animal_event.schema";
import { AnimalTable } from "./animal.model";
import { MemberTable, OrganizationTable } from "./auth.model";
import { DynamicSchema } from "./common/dynamic.schema";
import { StaticSchema } from "./common/static.schema";

export const AnimalEventTable = pgTable(
  "animal_events",
  {
    ...StaticSchema.id(),

    ...DynamicSchema.org_id(),
    ...DynamicSchema.animal_id(),

    created_by_member_id: DynamicSchema.member_id().member_id,
    administered_by_member_id: DynamicSchema.member_id().member_id,

    notes: text().default(""),
    timestamp: timestamp({ mode: "date" }).notNull(),
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
  ({ one }) => ({
    shelter: one(OrganizationTable, {
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
  }),
);

export type AnimalEvent = typeof AnimalEventTable.$inferSelect;

const refinements = {
  data: animal_event_data_schema,
  timestamp: z.coerce.date("Date is required"),

  notes: (s: z.ZodString) =>
    s.max(2000, "Notes must be at most 2000 characters"),
};

const pick = {
  data: true,
  notes: true,
  animal_id: true,
  timestamp: true,
  administered_by_member_id: true,
} satisfies Partial<Record<keyof AnimalEvent, true>>;

export namespace AnimalEventSchema {
  export const insert = createInsertSchema(AnimalEventTable, refinements).pick(
    pick,
  );
  export const update = createUpdateSchema(AnimalEventTable, refinements).pick(
    pick,
  );

  export type Insert = z.infer<typeof insert>;
  export type Update = z.infer<typeof update>;
}
