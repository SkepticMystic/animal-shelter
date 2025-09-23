import { get_member_session } from "$lib/auth/server";
import { db } from "$lib/server/db/drizzle.db";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load = (async ({ params }) => {
  const [session, animal] = await Promise.all([
    get_member_session(),

    db.query.animal.findFirst({
      where: (animal, { eq }) => eq(animal.short_id, params.short_id),

      with: {
        shelter: {
          columns: { name: true, short_id: true, place: true },
        },
        images: {
          columns: { url: true, thumbhash: true },
        },
      },
    }),
  ]);

  if (!animal || animal.org_id !== session.session.org_id) {
    error(404, "Animal not found");
  }

  return { animal };
}) satisfies PageServerLoad;
