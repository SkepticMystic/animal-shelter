import { get_session } from "$lib/auth/server";
import { db } from "$lib/server/db/drizzle.db";
import {
  AnimalEventSchema,
  AnimalEventTable,
} from "$lib/server/db/schema/animal_event.model";
import { error } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import { superValidate } from "sveltekit-superforms";
import { zod4 } from "sveltekit-superforms/adapters";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
  const [session, animal_event] = await Promise.all([
    get_session({ member_permissions: { animal_event: ["update"] } }),

    db.query.animal_event.findFirst({
      where: eq(AnimalEventTable.id, params.id),

      with: {
        images: {
          columns: { id: true, url: true, thumbhash: true },
        },
      },
    }),
  ]);

  if (!animal_event || animal_event.org_id !== session.session.org_id) {
    error(404, "Animal event not found");
  }

  const form_input = await superValidate(
    animal_event,
    zod4(AnimalEventSchema.insert),
  );

  return {
    form_input,
    animal_event,
  };
};
