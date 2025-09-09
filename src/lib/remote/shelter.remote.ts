import { query } from "$app/server";
import { db } from "$lib/server/db/drizzle.db";
import { AnimalTable } from "$lib/server/db/schema/animal.model";
import { OrganizationTable } from "$lib/server/db/schema/auth.model";
import { count, eq } from "drizzle-orm";
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
    const shelters = await db
      .select({
        id: OrganizationTable.id,
        name: OrganizationTable.name,
        slug: OrganizationTable.slug,
        logo: OrganizationTable.logo,
        createdAt: OrganizationTable.createdAt,

        animal_count: count(AnimalTable.id).as("animal_count"),
      })
      .from(OrganizationTable)
      .leftJoin(AnimalTable, eq(OrganizationTable.id, AnimalTable.org_id))
      .groupBy(OrganizationTable.id)
      .offset(input.pagination.offset)
      .limit(input.pagination.limit);

    return shelters;
  },
);
