import z from "zod";

// SOURCE: https://www.getmeknown.co.za
// - Numeric, 15 chars
// - Alphanumeric, 10 chars
// - 8 chars, starting with C, rest are numbers
export const microchip_number_schema = z
  .union(
    [
      z.string().regex(/^[0-9]{15}$/),
      z.string().regex(/^C[0-9]{7}$/),
      z.string().regex(/^[A-Za-z0-9]{10}$/),
    ],
    "Invalid microchip number format. Must either be: 15 digits, or 10 alphanumeric characters, or start with 'C' followed by 7 digits",
  )
  .brand<"MicrochipNumber">();

export type MicrochipNumber = z.infer<typeof microchip_number_schema>;

export const microchip_lookup_input_schema = z.object({
  microchip_number: microchip_number_schema,
});

export type MicrochipLookupInput = {
  Input: z.input<typeof microchip_lookup_input_schema>;
  Parsed: z.output<typeof microchip_lookup_input_schema>;
};
