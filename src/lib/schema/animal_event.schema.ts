import z from "zod";
import { microchip_number_schema } from "./microchip_lookup.schema";

// WARN: BE CAREFUL adding non-primitive fields to the objects...
// They're stored in a JSONB column in the DB, so they're stringified
// See https://github.com/SkepticMystic/animal-shelter/blob/eb49b812edb9b83e96fc9c28e928cb4d60532d23/src/lib/services/microchip_lookup/microchip_lookup.service.ts#L18
export const animal_event_data_schema = z.discriminatedUnion("kind", [
  z.object({
    kind: z.literal("weigh"),
    grams: z
      .number()
      .min(1, "Weight must be at least 1 gram")
      .max(1000000, "Weight must be at most 1,000,000 grams"),
  }),

  z.object({
    kind: z.literal("vaccine"),
    vaccine_name: z
      .string()
      .min(1, "Vaccine name is required")
      .max(255, "Vaccine name must be at most 255 characters"),
  }),

  z.object({
    kind: z.literal("sterilise"),
  }),

  z.object({
    kind: z.literal("microchip"),
    microchip_number: microchip_number_schema,
  }),
]);
