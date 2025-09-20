import z from "zod";

// TODO: Finetune based on real-life formats
// SOURCE: https://www.getmeknown.co.za
// Apparent requirements, either:
// - Numeric, 15 chars
// - Alphanumeric, 10 chars
// - 8 chars, starting with C, rest are numbers
export const microchip_number_schema = z
  .string()
  .min(8, { message: "Microchip number is required" })
  .max(15, { message: "Microchip number is too long" })
  .brand<"MicrochipNumber">();

export type MicrochipNumber = z.infer<typeof microchip_number_schema>;

export const microchip_lookup_input_schema = z.object({
  microchip_number: microchip_number_schema,
});

export type MicrochipLookupInput = {
  Input: z.input<typeof microchip_lookup_input_schema>;
  Parsed: z.output<typeof microchip_lookup_input_schema>;
};
