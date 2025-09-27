import { get_member_session } from "$lib/auth/server";
import { db } from "$lib/server/db/drizzle.db";
import { AnimalSchema } from "$lib/server/db/schema/animal.model";
import { error } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms";
import { zod4 } from "sveltekit-superforms/adapters";
import type { PageServerLoad } from "./$types";

export const load = (async ({ params }) => {
  const [session, animal] = await Promise.all([
    get_member_session({ member_permissions: { animal: ["update"] } }),

    db.query.animal.findFirst({
      where: (animal, { eq }) => eq(animal.short_id, params.short_id),

      with: {
        images: {
          columns: { id: true, url: true, thumbhash: true },
        },

        events: {
          columns: {
            id: true,
            data: true,
            notes: true,
            timestamp: true,
            administered_by_member_id: true,
          },
        },
      },
    }),
  ]);

  if (!animal || animal.org_id !== session.session.org_id) {
    error(404, "Animal not found");
  }

  const [animal_form_input] = await Promise.all([
    superValidate(animal, zod4(AnimalSchema.insert)),
  ]);

  return { animal, animal_form_input };
}) satisfies PageServerLoad;
