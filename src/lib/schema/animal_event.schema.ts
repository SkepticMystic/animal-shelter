import type { Animal } from "$lib/server/db/schema/animal.model";
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

  z.object({
    kind: z.literal("walk"),

    distance_meters: z
      .number()
      .min(1, "Distance must be at least 1 meter")
      .max(100_000, "Distance must be at most 100,000 meters")
      .optional(),

    duration_minutes: z
      .number()
      .min(1, "Duration must be at least 1 minute")
      .max(1_440, "Duration must be at most 1,440 minutes (24 hours)")
      .optional(),
  }),

  z.object({
    kind: z.literal("injury"),
  }),

  z.object({
    kind: z.literal("fostered" satisfies Animal["status"]),

    fosterer_name: z
      .string()
      .max(255, "Fosterer name must be at most 255 characters")
      .optional(),
  }),

  z.object({
    kind: z.literal("adopted" satisfies Animal["status"]),

    adopter_name: z
      .string()
      .max(255, "Adopter name must be at most 255 characters")
      .optional(),
  }),

  z.object({
    kind: z.literal("deceased" satisfies Animal["status"]),
  }),
]);
