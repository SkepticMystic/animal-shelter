import {
  adminClient,
  genericOAuthClient,
  inferAdditionalFields,
  inferOrgAdditionalFields,
  organizationClient,
  passkeyClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/svelte";
import type { auth } from "./auth";
import { AdminAccessControl } from "./const/admin.const";
import { OrganizationAccessControl } from "./const/organization.const";

export const BetterAuthClient = createAuthClient({
  plugins: [
    passkeyClient(),
    genericOAuthClient(),
    organizationClient({
      ...OrganizationAccessControl,

      schema: inferOrgAdditionalFields<typeof auth>(),
    }),
    adminClient({
      ...AdminAccessControl,
    }),

    inferAdditionalFields<typeof auth>(),
  ],
});
