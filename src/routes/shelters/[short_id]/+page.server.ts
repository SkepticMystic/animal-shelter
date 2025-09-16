import { db } from "$lib/server/db/drizzle.db";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load = (async ({ params }) => {
  const [shelter] = await Promise.all([
    db.query.shelter.findFirst({
      where: (shelter, { eq }) => eq(shelter.short_id, params.short_id),

      with: {
        images: {
          columns: { url: true, thumbhash: true },
        },

        animals: {
          with: {
            images: {
              columns: { url: true, thumbhash: true },
            },
          },
        },
      },
    }),
  ]);

  if (!shelter) {
    error(404, "Shelter not found");
  }

  return { shelter };
}) satisfies PageServerLoad;
