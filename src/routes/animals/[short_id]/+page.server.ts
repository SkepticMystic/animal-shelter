import { db } from "$lib/server/db/drizzle.db";
import { Markdown } from "$lib/utils/markdown";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load = (async ({ params }) => {
  const [animal] = await Promise.all([
    db.query.animal.findFirst({
      where: (animal, { eq }) => eq(animal.short_id, params.short_id),

      with: {
        images: {
          columns: { url: true, thumbhash: true },
        },
        shelter: {
          columns: { name: true, short_id: true, place: true },
        },
      },
    }),
  ]);

  if (!animal) {
    error(404, "Animal not found");
  }

  const prerendered = {
    description: animal.description
      ? Markdown.to_html(animal.description)
      : null,
  };

  return { animal, prerendered };
}) satisfies PageServerLoad;
