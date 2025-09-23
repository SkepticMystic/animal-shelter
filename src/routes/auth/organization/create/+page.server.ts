import { get_member_session } from "$lib/auth/server";
import { OrganizationSchema } from "$lib/server/db/schema/auth.model";
import { superValidate } from "sveltekit-superforms";
import { zod4 } from "sveltekit-superforms/adapters";
import type { PageServerLoad } from "./$types";

export const load = (async () => {
  const [form_input] = await Promise.all([
    superValidate(zod4(OrganizationSchema.insert)),

    get_member_session({ user_permissions: { organization: ["create"] } }),
  ]);

  return {
    form_input,
  };
}) satisfies PageServerLoad;
