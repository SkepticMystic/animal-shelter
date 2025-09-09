import {
  adminClient,
  genericOAuthClient,
  organizationClient,
  passkeyClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/svelte";
import { AdminAccessControl } from "./const/admin.const";
import { OrganizationAccessControl } from "./const/organization.const";

export const BetterAuthClient = createAuthClient({
  plugins: [
    passkeyClient(),
    genericOAuthClient(),
    organizationClient({
      ...OrganizationAccessControl,
    }),
    adminClient({
      ...AdminAccessControl,
    }),
  ],
});
