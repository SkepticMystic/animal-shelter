import {
  index,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
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

// const insert_animal_schema = createInsertSchema(AnimalTable, {
//   bio: (s) => s.max(1000),

//   date_of_birth: (s) =>
//     s //
//       .min(Dates.add_ms(-30 * TIME.YEAR)) //
//       .max(new Date()),
// });

// type InsertAnimal = z.infer<typeof insert_animal_schema>;
