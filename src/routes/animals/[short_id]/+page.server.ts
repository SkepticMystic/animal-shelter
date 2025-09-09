import { db } from "$lib/server/db/drizzle.db";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load = (async ({ params }) => {
  const [animal] = await Promise.all([
    db.query.animal.findFirst({
      where: (animal, { eq }) => eq(animal.short_id, params.short_id),

      with: {
        images: {
          columns: {
            id: true,
            url: true,
            provider: true,
          },
        },
      },
    }),
  ]);

  if (!animal) {
    error(404, "Animal not found");
  }

  return { animal };
}) satisfies PageServerLoad;
