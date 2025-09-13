import { randomUUID } from "crypto";
import { timestamp, uuid, varchar } from "drizzle-orm/pg-core";

const SHORT_ID_LENGTH = 8;

export const StaticSchema = {
  id: () => ({
    id: uuid().primaryKey().defaultRandom(),
  }),

  // CURSED: Adding the .unique constraint here causes drizzle to use the same constraint name for all tables that use short_id
  // So we wrap it in a function to create a new instance each time
  short_id: () => ({
    short_id: varchar({ length: SHORT_ID_LENGTH })
      .notNull()
      .unique()
      .$defaultFn(() => randomUUID().slice(0, SHORT_ID_LENGTH)),
  }),

  // NOTE: Tempting to snake_case these, but BetterAuth camels these by default
  // I'm sure I can remap them, but not bothered rn
  timestamps: {
    createdAt: timestamp({ mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp({ mode: "date" }).notNull().defaultNow(),
  },
};
