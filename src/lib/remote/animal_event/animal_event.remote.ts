import { command } from "$app/server";
import { safe_get_session } from "$lib/auth/server";
import { db } from "$lib/server/db/drizzle.db";
import { AnimalTable, type Animal } from "$lib/server/db/schema/animal.model";
import {
  AnimalEventSchema,
  AnimalEventTable,
  type AnimalEvent,
} from "$lib/server/db/schema/animal_event.model";
import type { APIResult } from "$lib/utils/form.util";
import { err, suc } from "$lib/utils/result.util";
import { and, eq } from "drizzle-orm";
import z from "zod";

const authorize_input = async (
  input: AnimalEventSchema.InsertOut,
  org_id: string,
): Promise<APIResult<null>> => {
  const resources = await Promise.all([
    input.administered_by_member_id
      ? db.query.member.findFirst({
          columns: { id: true },

          where: (member, { and, eq }) =>
            and(
              eq(member.organizationId, org_id),
              eq(member.id, input.administered_by_member_id!), //
            ),
        })
      : true,

    db.query.animal.findFirst({
      columns: { id: true },

      where: (animal, { and, eq }) =>
        and(
          eq(animal.org_id, org_id),
          eq(animal.id, input.animal_id), //
        ),
    }),
  ]);

  return resources.every(Boolean)
    ? suc(null)
    : err({ message: "Invalid event input" });
};

const update_animal = async (
  event: AnimalEventSchema.InsertOut,
): Promise<Animal | undefined> => {
  const clause = eq(AnimalTable.id, event.animal_id);

  switch (event.data.kind) {
    case "fostered":
    case "adopted":
    case "deceased": {
      return db
        .update(AnimalTable)
        .set({ status: event.data.kind })
        .where(clause)
        .returning()
        .then((r) => r.at(0));
    }

    case "sterilise": {
      return db
        .update(AnimalTable)
        .set({ sterilised: true })
        .where(clause)
        .returning()
        .then((r) => r.at(0));
    }

    case "microchip": {
      return db
        .update(AnimalTable)
        .set({ microchip_number: event.data.microchip_number })
        .where(clause)
        .returning()
        .then((r) => r.at(0));
    }
  }
};

export const create_animal_event_remote = command(
  AnimalEventSchema.insert,
  async (
    input,
  ): Promise<
    APIResult<{
      animal: Animal | undefined;
      animal_event: AnimalEvent;
    }>
  > => {
    const session = await safe_get_session({
      member_permissions: { animal_event: ["create"] },
    });
    if (!session || !session.session.org_id || !session.session.member_id) {
      return err({ message: "Unauthorized" });
    }

    const authorized = await authorize_input(input, session.session.org_id);
    if (!authorized) return authorized;

    const [[animal_event], animal] = await Promise.all([
      db
        .insert(AnimalEventTable)
        .values({
          ...input,
          org_id: session.session.org_id,
          created_by_member_id: session.session.member_id,
        })
        .returning(),

      update_animal(input),
    ]);

    return suc({ animal, animal_event });
  },
);

export const update_animal_event_remote = command(
  z.object({ id: z.uuid(), update: AnimalEventSchema.insert }),

  async (
    input,
  ): Promise<
    APIResult<{
      animal: Animal | undefined;
      animal_event: AnimalEvent;
    }>
  > => {
    const session = await safe_get_session({
      member_permissions: { animal_event: ["update"] },
    });
    if (!session || !session.session.org_id || !session.session.member_id) {
      return err({ message: "Unauthorized" });
    }

    const authorized = await authorize_input(
      input.update,
      session.session.org_id,
    );
    if (!authorized) return authorized;

    const [[animal_event], animal] = await Promise.all([
      db
        .update(AnimalEventTable)
        .set(input.update)
        .where(
          and(
            eq(AnimalEventTable.id, input.id),
            eq(AnimalEventTable.org_id, session.session.org_id),
          ),
        )
        .returning(),

      update_animal(input.update),
    ]);

    return animal_event
      ? suc({ animal, animal_event })
      : err({ message: "Animal event not found" });
  },
);

export const delete_animal_event_remote = command(
  z.object({ id: z.uuid() }),
  async (input): Promise<APIResult<AnimalEvent>> => {
    const session = await safe_get_session({
      member_permissions: { animal_event: ["delete"] },
    });
    if (!session || !session.session.org_id) {
      return err({ message: "Unauthorized" });
    }

    const [event] = await db
      .delete(AnimalEventTable)
      .where(
        and(
          eq(AnimalEventTable.id, input.id),
          eq(AnimalEventTable.org_id, session.session.org_id),
        ),
      )
      .returning();

    return event ? suc(event) : err({ message: "Animal event not found" });
  },
);
