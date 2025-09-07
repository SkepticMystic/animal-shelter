import { ANIMALS } from "$lib/const/animal.const";
import { TIME } from "$lib/const/time";
import { Dates } from "$lib/utils/dates";
import z from "zod";

export const AnimalSchema = {
  insert: z.object({
    name: z.string().min(1, "Name is required"),
    species: z.enum(ANIMALS.SPECIES.IDS),
    bio: z.string().nullable(),
    date_of_birth: z.coerce
      .date()
      .min(Dates.add_ms(-100 * TIME.YEAR))
      .max(new Date())
      .nullable(),
  }),
};
