import { command } from "$app/server";
import { safe_get_session } from "$lib/auth/server";
import { db } from "$lib/server/db/drizzle.db";
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
  input: AnimalEventSchema.Insert | AnimalEventSchema.Update,
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

    input.animal_id
      ? db.query.animal.findFirst({
          columns: { id: true },

          where: (animal, { and, eq }) =>
            and(
              eq(animal.org_id, org_id),
              eq(animal.id, input.animal_id!), //
            ),
        })
      : true,
  ]);

  return resources.every(Boolean)
    ? suc(null)
    : err({ message: "Invalid event input" });
};

export const create_animal_event_remote = command(
  AnimalEventSchema.insert,
  async (input): Promise<APIResult<AnimalEvent>> => {
    const session = await safe_get_session({
      member_permissions: { animal_event: ["create"] },
    });
    if (!session || !session.session.org_id || !session.session.member_id) {
      return err({ message: "Unauthorized" });
    }

    const authorized = await authorize_input(input, session.session.org_id);
    if (!authorized) return authorized;

    const [event] = await db
      .insert(AnimalEventTable)
      .values({
        animal_id: input.animal_id,
        org_id: session.session.org_id,
        created_by_member_id: session.session.member_id,
        administered_by_member_id: input.administered_by_member_id,

        data: input.data,
        notes: input.notes,
        timestamp: input.timestamp,
      })
      .returning();

    return suc(event);
  },
);

export const update_animal_event_remote = command(
  z.object({ id: z.uuid(), update: AnimalEventSchema.update }),
  async (input): Promise<APIResult<AnimalEvent>> => {
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

    const [event] = await db
      .update(AnimalEventTable)
      .set(input.update)
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
