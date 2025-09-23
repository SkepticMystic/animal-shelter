import { redirect } from "@sveltejs/kit";
import type { PageLoad } from "./$types";
import { ROUTES } from "$lib/const/routes.const";

export const load = (async () => {
  redirect(302, ROUTES.SHELTER_ANIMALS);
}) satisfies PageLoad;
