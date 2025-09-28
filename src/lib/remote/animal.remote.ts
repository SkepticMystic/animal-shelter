import { command, query } from "$app/server";
import { BetterAuthClient } from "$lib/auth-client";
import { get_member_session } from "$lib/auth/server";
import { ANIMALS } from "$lib/const/animal.const";
import type { IOrganization } from "$lib/const/organization.const";
import { field_filter, filter_to_where } from "$lib/schema/query/query.schema";
import { db } from "$lib/server/db/drizzle.db";
import {
  AnimalSchema,
  AnimalTable,
  type Animal,
} from "$lib/server/db/schema/animal.model";
import { AnimalEventTable } from "$lib/server/db/schema/animal_event.model";
import { ImageService } from "$lib/services/image.service";
import { MicrochipLookupLive } from "$lib/services/microchip_lookup/microchip_lookup.service";
import type { APIResult } from "$lib/utils/form.util";
import { MicrochipLookupUtil } from "$lib/utils/microchip_lookup/microchip_lookup.utils";
import { err, suc } from "$lib/utils/result.util";
import { and, eq } from "drizzle-orm";
import z from "zod";

const SMART_FIELDS = ["name", "description"] satisfies (keyof Animal)[];

const animal_query_schema = z.object({
  where: z
    .object({
      id: field_filter(z.uuid(), ["eq", "ne", "in", "nin"]),
      org_id: field_filter(z.uuid(), ["eq", "in"]),

      gender: field_filter(z.enum(ANIMALS.GENDER.IDS), ["in"]),
      status: field_filter(z.enum(ANIMALS.STATUS.IDS), ["in", "ne"]),
      species: field_filter(z.enum(ANIMALS.SPECIES.IDS), ["eq", "in"]),
    })
    .optional(),

  smart: z
    .object({
      query: z.string().max(100),
      fields: z.array(z.enum(SMART_FIELDS)).default(SMART_FIELDS),
    })
    .optional(),

  pagination: z
    .object({
      offset: z.number().min(0).default(0),
      limit: z.number().min(1).max(100).default(10),
    })
    .default({ limit: 100, offset: 0 }),
});

export const get_animals_remote = query(
  animal_query_schema,

  async (input) => {
    try {
      console.log("get_animals_remote input:", input);

      return await db.query.animal.findMany({
        ...input.pagination,

        where: filter_to_where(AnimalTable, input.where),

        with: {
          images: {
            columns: { url: true, thumbhash: true },
          },
          shelter: {
            columns: { name: true, short_id: true },
          },
        },
      });
    } catch (error) {
      console.error("Error in get_animals_remote:", error);
      throw error;
    }
  },
);

export const get_shelter_animals_remote = query(
  animal_query_schema,

  async (input) => {
    const session = await get_member_session();

    try {
      console.log("get_shelter_animals_remote input:", input);

      return await db.query.animal.findMany({
        ...input.pagination,

        where: filter_to_where(AnimalTable, {
          ...input.where,
          org_id: { eq: session.session.org_id },
        }),

        with: {
          images: {
            columns: { url: true, thumbhash: true },
          },
        },
      });
    } catch (error) {
      console.error("get_shelter_animals_remote error:", error);
      throw error;
    }
  },
);

export const create_animal_remote = command(
  AnimalSchema.insert,

  async (input): Promise<APIResult<Animal>> => {
    const [session] = await Promise.all([
      get_member_session({ member_permissions: { animal: ["create"] } }),
    ]);

    const [[animal], microchip_lookup] = await Promise.all([
      db
        .insert(AnimalTable)
        .values({
          ...input,
          org_id: session.session.org_id,
        })
        .returning(),

      input.microchip_number &&
      BetterAuthClient.organization.checkRolePermission({
        role: session.session.member_role as IOrganization.RoleId,
        permissions: { animal_event: ["create"], microchip_lookup: ["create"] },
      })
        ? MicrochipLookupLive.lookup({
            microchip_number: input.microchip_number,
          })
        : null,
    ]);

    if (microchip_lookup && microchip_lookup.ok) {
      const merged = MicrochipLookupUtil.merge_results_data(
        microchip_lookup.data,
      );

      if (merged.found) {
        await db
          .insert(AnimalEventTable)
          .values({
            ...merged.animal_event,

            animal_id: animal.id,
            org_id: session.session.org_id,
            created_by_member_id: session.session.member_id,
          })
          .returning();
      }
    }

    return suc(animal);
  },
);

export const update_animal_remote = command(
  z.object({
    id: z.uuid(),
    update: AnimalSchema.update,
  }),

  async (input): Promise<APIResult<Animal>> => {
    const [session] = await Promise.all([
      get_member_session({ member_permissions: { animal: ["update"] } }),
    ]);

    const [animal] = await db
      .update(AnimalTable)
      .set({ ...input.update, updatedAt: new Date() })
      .where(
        and(
          eq(AnimalTable.id, input.id),
          eq(AnimalTable.org_id, session.session.org_id),
        ),
      )
      .returning();

    if (!animal) {
      return err({ message: "Animal not found", status: 404 });
    } else {
      return suc(animal);
    }
  },
);

export const delete_animal_remote = command(
  z.uuid(),

  async (id): Promise<APIResult<null>> => {
    const [session] = await Promise.all([
      get_member_session({ member_permissions: { animal: ["delete"] } }),
    ]);

    const [res] = await Promise.all([
      db
        .delete(AnimalTable)
        .where(
          and(
            eq(AnimalTable.id, id),
            eq(AnimalTable.org_id, session.session.org_id),
          ),
        ),

      ImageService.delete({
        resource_id: id,
        resource_kind: "animal",
        org_id: session.session.org_id,
      }),
    ]);

    if (res.rowCount === 0) {
      return err({ message: "Animal not found", status: 404 });
    } else {
      return suc(null);
    }
  },
);
