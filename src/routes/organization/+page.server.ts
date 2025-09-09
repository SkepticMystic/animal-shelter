import { get_session } from "$lib/auth/server";
import { AuthSchema } from "$lib/schema/auth.schema";
import { db } from "$lib/server/db/drizzle.db";
import { OrganizationSchema } from "$lib/server/db/schema/auth.model";
import { superValidate } from "sveltekit-superforms";
import { zod4 } from "sveltekit-superforms/adapters";
import type { PageServerLoad } from "./$types";

export const load = (async () => {
  const { session } = await get_session();

  const [create_org_form_input, member_invite_form_input, organization] =
    await Promise.all([
      superValidate(zod4(OrganizationSchema.insert)),
      superValidate(zod4(AuthSchema.Org.member_invite_form)),

      session.activeOrganizationId
        ? db.query.organization.findFirst({
            where: (org, { eq }) => eq(org.id, session.activeOrganizationId!),
            with: {
              members: {
                columns: { id: true, role: true, createdAt: true },
                with: {
                  user: { columns: { name: true, email: true, image: true } },
                },
              },
            },
          })
        : null,
    ]);

  return {
    organization,

    member_invite_form_input,

    create_org_form_input,
    update_org_form_input: await superValidate(
      organization ?? {},
      // Insert, because we update the whole org at once,
      // Using the same OrganizationForm as for creation
      zod4(OrganizationSchema.insert),
    ),
  };
}) satisfies PageServerLoad;
