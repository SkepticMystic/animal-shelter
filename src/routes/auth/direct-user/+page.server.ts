import { safe_get_session } from "$lib/auth/server";
import { ROUTES } from "$lib/const/routes.const";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { App } from "$lib/utils/app.js";

export const load = (async ({ url }) => {
  const session = await safe_get_session();

  if (!session) {
    redirect(302, App.url(ROUTES.AUTH_SIGNIN, url.searchParams));
  } else if (!session.session.org_id) {
    redirect(302, App.url(ROUTES.HOME, url.searchParams));
  } else {
    redirect(302, App.url(ROUTES.SHELTER, url.searchParams));
  }
}) satisfies PageServerLoad;
