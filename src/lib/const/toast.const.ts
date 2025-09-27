const TOAST_IDS = {
  SIGNED_UP: "signed-up",
  SIGNED_IN: "signed-in",
  SIGNED_OUT: "signed-out",
  USER_DELETED: "user-deleted",
  PASSKEY_ADDED: "passkey-added",
  EMAIL_VERIFIED: "email-verified",
  EMAIL_UNVERIFIED: "email-unverified",
  PASSWORD_RESET: "password-reset",

  ORG_INVITE_ACCEPTED: "org-invite-accepted",

  ADMIN_IMPERSONATING_USER: "admin-impersonating-user",

  UNAUTHORIZED: "unauthorized",
  UNAUTHENTICATED: "unauthenticated",
} as const;

const TOAST_IDS_REVERSED = Object.fromEntries(
  Object.entries(TOAST_IDS).map(([key, value]) => [value, key]),
) as Record<IToast.Id, IToast.Key>;

export declare namespace IToast {
  export type Key = keyof typeof TOAST_IDS;
  export type Id = (typeof TOAST_IDS)[IToast.Key];

  export type Input = {
    type: "success" | "error" | "info" | "warning";
    message: string;
  };
}

export const TOAST = {
  IDS: TOAST_IDS,
  IDS_REVERSED: TOAST_IDS_REVERSED,

  MAP: {
    SIGNED_UP: {
      type: "success",
      message: "Signed up successfully",
    },
    SIGNED_IN: {
      type: "success",
      message: "Signed in successfully",
    },
    SIGNED_OUT: {
      type: "info",
      message: "Signed out",
    },

    USER_DELETED: {
      type: "success",
      message: "User deleted successfully",
    },

    PASSKEY_ADDED: {
      type: "success",
      message: "Passkey added successfully",
    },

    EMAIL_VERIFIED: {
      type: "success",
      message: "Email verified successfully",
    },
    EMAIL_UNVERIFIED: {
      type: "info",
      message: "You must first verify your email address",
    },

    PASSWORD_RESET: {
      type: "success",
      message: "Password reset successfully",
    },

    ORG_INVITE_ACCEPTED: {
      type: "success",
      message: "Invitation accepted successfully",
    },

    ADMIN_IMPERSONATING_USER: {
      type: "info",
      message: "You are now impersonating this user",
    },

    UNAUTHORIZED: {
      type: "error",
      message: "You do not have permission to perform this action",
    },
    UNAUTHENTICATED: {
      type: "warning",
      message: "You must be signed in first",
    },
  } satisfies Record<IToast.Key, IToast.Input>,
};
