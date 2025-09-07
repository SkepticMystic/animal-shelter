import { command, query } from "$app/server";
import { safe_get_session } from "$lib/auth/server";
import { AnimalSchema } from "$lib/schema/animal.schema";
import { db } from "$lib/server/db/drizzle.db";
import { AnimalTable, type Animal } from "$lib/server/db/schema/animal.model";
import type { APIResult } from "$lib/utils/form.util";
import { err, suc } from "$lib/utils/result.util";
import { and, eq } from "drizzle-orm";
import z from "zod";

export const get_animals_remote = query(
  z.object({
    pagination: z
      .object({
        offset: z.number().min(0).default(0),
        limit: z.number().min(1).max(100).default(10),
      })
      .default({ limit: 100, offset: 0 }),
  }),

  async (input) => {
    const animals = await db.query.animal.findMany({
      ...input.pagination,
    });

    return animals;
  },
);

export const create_animal_remote = command(
  AnimalSchema.insert,

  async (input): Promise<APIResult<Animal>> => {
    const session = await safe_get_session();
    if (!session || !session.session.org_id) {
      return err({ message: "Unauthorized", status: 401 });
    }

    const [animal] = await db
      .insert(AnimalTable)
      .values({
        ...input,
        org_id: session.session.org_id,
      })
      .returning();

    return suc(animal);
  },
);

export const patch_animal_remote = command(
  z.object({
    id: z.uuid(),
    patch: AnimalSchema.insert.partial(),
  }),

  async (input): Promise<APIResult<Animal>> => {
    const session = await safe_get_session();
    if (!session || !session.session.org_id || !session.session.member_id) {
      return err({ message: "Unauthorized", status: 401 });
    }

    const [animal] = await db
      .update(AnimalTable)
      .set(input.patch)
      .where(
        and(
          eq(AnimalTable.id, input.id),
          eq(AnimalTable.org_id, session.session.org_id),
        ),
      )
      .returning();

    if (!animal) {
      return err({ message: "Animal not found", status: 404 });
    }

    return suc(animal);
  },
);
