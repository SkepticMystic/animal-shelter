import { get_member_session } from "$lib/auth/server";
import { AnimalSchema } from "$lib/server/db/schema/animal.model";
import { superValidate } from "sveltekit-superforms";
import { zod4 } from "sveltekit-superforms/adapters";
import type { PageServerLoad } from "./$types";

export const load = (async () => {
  const [form_input] = await Promise.all([
    superValidate(
      {
        status: "available",
        gender: "u",
        species: "dog",
      }, //
      zod4(AnimalSchema.insert),
    ),

    get_member_session({ member_permissions: { animal: ["create"] } }),
  ]);

  return { form_input };
}) satisfies PageServerLoad;
