import type { RouteId } from "$app/types";

export const ROUTES = {
  HOME: "/",

  ADMIN: "/admin",

  AUTH_SIGNUP: "/auth/signup",
  AUTH_SIGNIN: "/auth/signin",
  AUTH_VERIFY_EMAIL: "/auth/verify-email",
  AUTH_FORGOT_PASSWORD: "/auth/forgot-password",
  AUTH_RESET_PASSWORD: "/auth/reset-password",

  AUTH_ORGANIZATION_ACCEPT_INVITE: "/auth/organization/accept-invite",

  PROFILE: "/profile",
  ORGANIZATION: "/organization",

  SHELTERS: "/shelters",
  SHELTERS_VIEW: "/shelters/[slug]",

  ANIMALS: "/animals",
  ANIMALS_VIEW: "/animals/[short_id]",
  ANIMALS_EDIT: "/animals/[short_id]/edit",
} satisfies Record<string, RouteId>;
