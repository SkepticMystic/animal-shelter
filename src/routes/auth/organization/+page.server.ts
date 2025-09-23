import { get_member_session } from "$lib/auth/server";
import { AuthSchema } from "$lib/schema/auth.schema";
import { db } from "$lib/server/db/drizzle.db";
import { superValidate } from "sveltekit-superforms";
import { zod4 } from "sveltekit-superforms/adapters";
import type { PageServerLoad } from "./$types";

export const load = (async () => {
  const { session } = await get_member_session();

  const [member_invite_form_input, organization] = await Promise.all([
    superValidate(zod4(AuthSchema.Org.member_invite_form)),

    db.query.organization.findFirst({
      where: (org, { eq }) => eq(org.id, session.org_id),
      with: {
        members: {
          columns: { id: true, role: true, createdAt: true },
          with: {
            user: { columns: { name: true, email: true, image: true } },
          },
        },
      },
    }),
  ]);

  return {
    organization,

    member_invite_form_input,
  };
}) satisfies PageServerLoad;
