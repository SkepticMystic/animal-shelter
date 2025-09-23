import { get_member_session } from "$lib/auth/server";
import type { PageServerLoad } from "./$types";

export const load = (async () => {
  await get_member_session();

  return {};
}) satisfies PageServerLoad;
