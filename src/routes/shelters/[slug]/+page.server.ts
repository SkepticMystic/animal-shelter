import { db } from "$lib/server/db/drizzle.db";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load = (async ({ params }) => {
  const [shelter] = await Promise.all([
    db.query.organization.findFirst({
      where: (shelter, { eq }) => eq(shelter.slug, params.slug),

      with: {
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
