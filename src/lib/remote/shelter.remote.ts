import { query } from "$app/server";
import { db } from "$lib/server/db/drizzle.db";
import z from "zod";

export const get_shelters_remote = query(
  z.object({
    pagination: z
      .object({
        offset: z.number().min(0).default(0),
        limit: z.number().min(1).max(100).default(10),
      })
      .default({ limit: 100, offset: 0 }),
  }),

  async (input) => {
    const shelters = await db.query.organization.findMany({
      with: {
        images: {
          columns: { url: true, thumbhash: true },
        },
        animals: {
          columns: { id: true },
        },
      },

      limit: input.pagination.limit,
      offset: input.pagination.offset,
    });

    return shelters;
  },
);
