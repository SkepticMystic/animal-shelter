import { AnimalSchema } from "$lib/server/db/schema/animal.model";
import { superValidate } from "sveltekit-superforms";
import { zod4 } from "sveltekit-superforms/adapters";
import type { PageServerLoad } from "./$types";

export const load = (async () => {
  const form_input = await superValidate(zod4(AnimalSchema.insert));

  return {
    form_input,
  };
}) satisfies PageServerLoad;
