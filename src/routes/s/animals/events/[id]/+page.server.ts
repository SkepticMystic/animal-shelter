import { get_member_session } from "$lib/auth/server";
import { db } from "$lib/server/db/drizzle.db";
import { AnimalEventTable } from "$lib/server/db/schema/animal_event.model";
import { error } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
  const [session, animal_event] = await Promise.all([
    get_member_session(),

    db.query.animal_event.findFirst({
      where: eq(AnimalEventTable.id, params.id),

      with: {
        animal: {
          columns: { short_id: true, name: true },
        },

        images: {
          columns: { url: true, thumbhash: true },
        },

        administrator: {
          columns: {},
          with: {
            user: {
              columns: { name: true, image: true },
            },
          },
        },
      },
    }),
  ]);

  if (!animal_event || animal_event.org_id !== session.session.org_id) {
    error(404, "Animal event not found");
  }

  return {
    animal_event,
  };
};
