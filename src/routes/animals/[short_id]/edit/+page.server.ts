import { get_session } from "$lib/auth/server";
import { db } from "$lib/server/db/drizzle.db";
import { AnimalSchema } from "$lib/server/db/schema/animal.model";
import { error } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms";
import { zod4 } from "sveltekit-superforms/adapters";
import type { PageServerLoad } from "./$types";

export const load = (async ({ params }) => {
  const [session, animal] = await Promise.all([
    get_session(),
    db.query.animal.findFirst({
      where: (animal, { eq }) => eq(animal.short_id, params.short_id),

      with: {
        shelter: {
          columns: { id: true, name: true, short_id: true },
        },
        images: {
          columns: { id: true, url: true, thumbhash: true },
        },
      },
    }),
  ]);

  if (
    !animal ||
    !session ||
    animal.org_id !== session.session.activeOrganizationId
  ) {
    error(404, "Animal not found");
  }

  const form_input = await superValidate(animal, zod4(AnimalSchema.insert));

  return { animal, form_input };
}) satisfies PageServerLoad;
