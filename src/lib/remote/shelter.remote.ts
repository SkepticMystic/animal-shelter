import { command, query } from "$app/server";
import { safe_get_member_session, safe_get_session } from "$lib/auth/server";
import { db } from "$lib/server/db/drizzle.db";
import {
  ShelterSchema,
  ShelterTable,
  type Shelter,
} from "$lib/server/db/schema/shelter.model";
import type { APIResult } from "$lib/utils/form.util";
import { err, suc } from "$lib/utils/result.util";
import { and, eq } from "drizzle-orm";
import z from "zod";

export const get_active_shelter_remote = query(
  z.void(),

  async (): Promise<Shelter | null> => {
    const session = await safe_get_member_session();
    if (!session) {
      return null;
    }

    const shelter = await db.query.shelter.findFirst({
      where: (shelter, { eq }) => eq(shelter.org_id, session.session.org_id),
    });

    return shelter ?? null;
  },
);

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
    const shelters = await db.query.shelter.findMany({
      with: {
        images: {
          columns: { url: true, thumbhash: true },
        },

        animals: {
          columns: { short_id: true, name: true },
        },
      },

      limit: input.pagination.limit,
      offset: input.pagination.offset,
    });

    return shelters;
  },
);

export const update_shelter_remote = command(
  z.object({
    id: z.uuid(),
    update: ShelterSchema.update,
  }),

  async (input): Promise<APIResult<Shelter>> => {
    const [session] = await Promise.all([
      safe_get_session({
        member_permissions: { organization: ["update"] },
      }),
    ]);
    if (!session || !session.session.org_id) {
      return err({ message: "Unauthorized", status: 401 });
    }

    const [shelter] = await db
      .update(ShelterTable)
      .set(input.update)
      .where(
        and(
          eq(ShelterTable.id, input.id),
          eq(ShelterTable.org_id, session.session.org_id),
        ),
      )
      .returning();

    return shelter
      ? suc(shelter)
      : err({ message: "Shelter not found", status: 404 });
  },
);
