import z from "zod";

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
    kind: z.literal("spay-neuter"),
  }),

  z.object({
    kind: z.literal("microchip"),
    // SOURCE: https://www.getmeknown.co.za
    // Apparent requirements, either:
    // - Numeric, 15 chars
    // - Alphanumeric, 10 chars
    // - 8 chars, starting with C, rest are numbers
    microchip_id: z
      .string()
      .min(1, "Microchip ID is required")
      .max(255, "Microchip ID must be at most 255 characters"),
  }),
]);
