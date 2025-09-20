import parsePhoneNumber from "libphonenumber-js";
import z from "zod";

const preproc_full_tel_schema = z.preprocess(
  (cell) => {
    if (typeof cell !== "string") {
      return false;
    }

    const parsed = parsePhoneNumber(cell, "ZA");

    if (parsed && parsed.isValid()) {
      return {
        number: parsed.number,
        country: parsed.country,
      };
    } else {
      console.log("preproc_full_tel_schema invalid cell", cell);
      return false;
    }
  },
  z.object(
    {
      number: z.string(),
      country: z.string().optional(),
    },
    "Invalid phone number",
  ),
);

export const tel_schema = {
  full: preproc_full_tel_schema,
  number: preproc_full_tel_schema.transform((msisdn) => msisdn.number),
};
