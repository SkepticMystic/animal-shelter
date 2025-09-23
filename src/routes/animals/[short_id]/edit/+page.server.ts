import { get_session } from "$lib/auth/server";
import { ANIMAL_EVENTS } from "$lib/const/animal_event.const";
import { db } from "$lib/server/db/drizzle.db";
import { AnimalSchema } from "$lib/server/db/schema/animal.model";
import { AnimalEventSchema } from "$lib/server/db/schema/animal_event.model";
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

  if (
    !animal ||
    !session ||
    animal.org_id !== session.session.activeOrganizationId
  ) {
    error(404, "Animal not found");
  }

  const [animal_form_input, event_form_input] = await Promise.all([
    superValidate(animal, zod4(AnimalSchema.insert)),

    superValidate(
      {
        notes: "",
        animal_id: animal.id,
        timestamp: new Date(),
        administered_by_member_id: session?.session.member_id ?? "",
        data: {
          ...ANIMAL_EVENTS.KINDS.DEFAULT_DATA[ANIMAL_EVENTS.KINDS.IDS[0]],
        },
      },
      zod4(AnimalEventSchema.insert),
    ),
  ]);

  return { animal, animal_form_input, event_form_input };
}) satisfies PageServerLoad;
