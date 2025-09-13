import { BetterAuthClient } from "$lib/auth-client";
import type { IAdmin } from "$lib/const/admin.const";
import type { IOrganization } from "$lib/const/organization.const";
import { session } from "$lib/stores/session";
import { get } from "svelte/store";

export const AccessClient = {
  user_can: (
    permissions: Parameters<
      typeof BetterAuthClient.admin.checkRolePermission
    >[0]["permissions"],
  ): boolean => {
    // Not sure why we need to check this when I derive the type from the util I call... but ok
    if (!permissions) return true;

    const $session = get(session);
    if (!$session.data || !$session.data.user.role) {
      console.log("no user role", $session.data);
      return false;
    }

    return BetterAuthClient.admin.checkRolePermission({
      permissions,
      role: $session.data.user.role as IAdmin.RoleId,
    });
  },

  member_can: (
    permissions: Parameters<
      typeof BetterAuthClient.organization.checkRolePermission
    >[0]["permissions"],
  ): boolean => {
    // Not sure why we need to check this when I derive the type from the util I call... but ok
    if (!permissions) return true;

    const $session = get(session);
    if (!$session.data || !$session.data.session.member_role) {
      console.log("no member role", $session.data);
      return false;
    }

    return BetterAuthClient.organization.checkRolePermission({
      permissions,
      role: $session.data.session.member_role as IOrganization.RoleId,
    });
  },

  org_owns: (resource: { org_id: string }): boolean => {
    const $session = get(session);
    return $session.data?.session.activeOrganizationId === resource.org_id;
  },
};
