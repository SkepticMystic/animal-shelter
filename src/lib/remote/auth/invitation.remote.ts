import { query } from "$app/server";
import { get_session } from "$lib/auth/server";
import { ORGANIZATION } from "$lib/const/organization.const";
import { db } from "$lib/server/db/drizzle.db";
import type { APIResult } from "$lib/utils/form.util";
import { err, suc } from "$lib/utils/result.util";
import type { Invitation } from "better-auth/plugins";
import z from "zod";

export const get_invitations_remote = query(
  z.object({
    status: z.enum(ORGANIZATION.INVITATIONS.STATUSES.IDS).optional(),
  }),
  async (input): Promise<APIResult<Invitation[]>> => {
    const session = await get_session();
    if (!session || !session.session.org_id) {
      return err({ message: "Unauthorized", status: 401 });
    }

    const invitations = await db.query.invitation.findMany({
      where: (invitation, { eq, and }) =>
        and(
          eq(invitation.organizationId, session.session.org_id!),
          input.status ? eq(invitation.status, input.status) : undefined,
        ),

      orderBy: (invitation, { desc }) => [desc(invitation.createdAt)],
    });

    return suc(invitations);
  },
);
