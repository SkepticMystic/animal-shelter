import { get_member_session } from "$lib/auth/server";
import { Parsers } from "$lib/schema/parsers";
import { AnimalEventSchema } from "$lib/server/db/schema/animal_event.model";
import { superValidate } from "sveltekit-superforms";
import { zod4 } from "sveltekit-superforms/adapters";
import z from "zod";
import type { PageServerLoad } from "./$types";

export const load = (async ({ url }) => {
  const search = Parsers.url(url, z.object({ animal_id: z.uuid().optional() }));

  const [form_input] = await Promise.all([
    superValidate(
      { animal_id: search.animal_id },
      zod4(AnimalEventSchema.insert),
    ),

    get_member_session({ member_permissions: { animal_event: ["create"] } }),
  ]);

  return { form_input };
}) satisfies PageServerLoad;
