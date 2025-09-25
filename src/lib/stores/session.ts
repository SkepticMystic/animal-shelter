import { BetterAuthClient } from "$lib/auth-client";
import { derived } from "svelte/store";

export const session = BetterAuthClient.useSession();

// export const HOME_ROUTE = derived(session, ($session): ResolvedPathname => {
//   if (
//     $session.isPending ||
//     $session.isRefetching ||
//     !$session.data ||
//     !$session.data.session.activeOrganizationId
//   ) {
//     console.log("Redirecting to HOME");
//     return App.url(ROUTES.HOME, page.url.searchParams);
//   } else {
//     console.log("Redirecting to SHELTER");
//     return App.url(ROUTES.SHELTER, page.url.searchParams);
//   }
// });

export const user = derived(
  session,
  ($session) => $session?.data?.user ?? null,
);

export const member = BetterAuthClient.useActiveMember();
