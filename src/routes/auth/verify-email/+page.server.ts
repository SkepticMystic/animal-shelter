import { safe_get_session } from "$lib/auth/server";
import { ROUTES } from "$lib/const/routes.const";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load = (async () => {
  const session = await safe_get_session({ email_verified: false });
  if (session?.user.emailVerified) {
    redirect(302, ROUTES.AUTH_DIRECT_USER);
  }

  return {};
}) satisfies PageServerLoad;
