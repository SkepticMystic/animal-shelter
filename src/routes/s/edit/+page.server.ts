import { get_member_session } from "$lib/auth/server";
import { db } from "$lib/server/db/drizzle.db";
import { ShelterSchema } from "$lib/server/db/schema/shelter.model";
import { error } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms";
import { zod4 } from "sveltekit-superforms/adapters";
import type { PageServerLoad } from "./$types";

export const load = (async () => {
  const { session } = await get_member_session();

  const [shelter] = await Promise.all([
    db.query.shelter.findFirst({
      where: (shelter, { eq }) => eq(shelter.org_id, session.org_id),

      with: {
        images: {
          columns: { id: true, url: true, thumbhash: true },
        },
      },
    }),
  ]);

  if (!shelter) {
    error(404, "Shelter not found");
  }

  return {
    shelter,
    update_shelter_form_input: await superValidate(
      shelter,
      // Insert, because we update the whole org at once,
      zod4(ShelterSchema.insert),
    ),
  };
}) satisfies PageServerLoad;
