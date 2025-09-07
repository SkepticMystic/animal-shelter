import { randomUUID } from "crypto";
import { timestamp, varchar } from "drizzle-orm/pg-core";

const SHORT_ID_LENGTH = 8;

export const Schema = {
  short_id: {
    short_id: varchar({ length: SHORT_ID_LENGTH })
      .notNull()
      .unique()
      .$defaultFn(() => randomUUID().slice(0, SHORT_ID_LENGTH)),
  },

  // NOTE: Tempting to snake_case these, but BetterAuth camels these by default
  // I'm sure I can remap them, but not bothered rn
  timestamps: {
    createdAt: timestamp({ mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp({ mode: "date" }).notNull().defaultNow(),
  },
};
