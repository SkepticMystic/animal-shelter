import { ROUTES } from "$lib/const/routes.const";
import { App } from "$lib/utils/app.js";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load = (async ({ url }) => {
  // Just redirect to home for now
  redirect(302, App.url(ROUTES.HOME, url.searchParams));

  //     const session = await safe_get_session();

  //   if (!session || !session.session.org_id) {
  //     redirect(302, App.url(ROUTES.HOME, url.searchParams));
  //   } else {
  //     redirect(302, App.url(ROUTES.SHELTER, url.searchParams));
  //   }
}) satisfies PageServerLoad;
