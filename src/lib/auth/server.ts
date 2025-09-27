import { getRequestEvent } from "$app/server";
import { auth } from "$lib/auth";
import { BetterAuthClient } from "$lib/auth-client";
import type { IAdmin } from "$lib/const/admin.const";
import {
  ORGANIZATION,
  type IOrganization,
} from "$lib/const/organization.const";
import { ROUTES } from "$lib/const/routes.const";
import { TOAST } from "$lib/const/toast.const";
import { App } from "$lib/utils/app";
import { Log } from "$lib/utils/logger.util";
import { redirect } from "@sveltejs/kit";

type Options = {
  /** Must be an admin */
  admin?: boolean;

  email_verified?: boolean;

  user_permissions?: Parameters<
    typeof BetterAuthClient.admin.checkRolePermission
  >[0]["permissions"];

  member_permissions?: Parameters<
    typeof BetterAuthClient.organization.checkRolePermission
  >[0]["permissions"];
};

// NOTE: Try not to exit with an SK `error`. Remote functions don't seem to handle them well
// Rather redirect with a toast flash
export const get_session = async (options?: Options) => {
  const event = getRequestEvent();

  const resolved = {
    admin: false,
    email_verified: true,

    ...(options ?? {}),
  };

  const session = await auth.api.getSession({ headers: event.request.headers });

  if (!session) {
    redirect(
      302,
      App.url(ROUTES.AUTH_SIGNIN, { toast: TOAST.IDS.UNAUTHENTICATED }),
    );
  } else if (resolved.email_verified && !session.user.emailVerified) {
    redirect(
      302,
      App.url(ROUTES.AUTH_VERIFY_EMAIL, { toast: TOAST.IDS.EMAIL_UNVERIFIED }),
    );
  } else if (resolved.admin && session.user.role !== "admin") {
    redirect(302, App.url(ROUTES.HOME, { toast: TOAST.IDS.UNAUTHORIZED }));
  }

  // Permission checks
  /// User
  if (options?.user_permissions) {
    const role_check = BetterAuthClient.admin.checkRolePermission({
      permissions: options.user_permissions,
      role: (session.user.role as IAdmin.RoleId | undefined) || "user",
    });

    if (!role_check) {
      redirect(302, App.url(ROUTES.HOME, { toast: TOAST.IDS.UNAUTHORIZED }));
    }
  }

  /// Member
  if (options?.member_permissions) {
    if (!session.session.member_role) {
      redirect(302, App.url(ROUTES.HOME, { toast: TOAST.IDS.UNAUTHORIZED }));
    }

    const member_role = ORGANIZATION.ROLES.IDS.includes(
      session.session.member_role as IOrganization.RoleId,
    )
      ? (session.session.member_role as IOrganization.RoleId)
      : undefined;

    if (!member_role) {
      redirect(302, App.url(ROUTES.HOME, { toast: TOAST.IDS.UNAUTHORIZED }));
    }

    const role_check = BetterAuthClient.organization.checkRolePermission({
      role: member_role,
      permissions: options.member_permissions,
    });

    if (!role_check) {
      redirect(302, App.url(ROUTES.HOME, { toast: TOAST.IDS.UNAUTHORIZED }));
    }
  }

  return {
    user: session.user,
    session: {
      ...session.session,
      org_id: session.session.activeOrganizationId,
    },
  };
};

export const safe_get_session = async (options?: Options) => {
  try {
    return await get_session(options);
  } catch (e) {
    Log.info(e, "safe_get_session error");

    return null;
  }
};

export const get_member_session = async (options?: Options) => {
  const session = await get_session(options);

  if (
    !session.session.org_id ||
    !session.session.member_id ||
    !session.session.member_role ||
    !session.session.activeOrganizationId
  ) {
    redirect(302, App.url(ROUTES.HOME, { toast: TOAST.IDS.UNAUTHORIZED }));
  }

  return {
    user: session.user,
    session: {
      ...session.session,
      org_id: session.session.org_id!,
      member_id: session.session.member_id!,
      member_role: session.session.member_role!,
      activeOrganizationId: session.session.activeOrganizationId!,
    },
  };
};

export const safe_get_member_session = async (options?: Options) => {
  try {
    return await get_member_session(options);
  } catch (e) {
    Log.info(e, "safe_get_member_session error");

    return null;
  }
};
