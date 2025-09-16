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
  SHELTERS_VIEW: "/shelters/[short_id]",

  ANIMALS: "/animals",
  ANIMALS_VIEW: "/animals/[short_id]",
  ANIMALS_EDIT: "/animals/[short_id]/edit",

  ANIMAL_EVENTS: "/animals/events",
  ANIMAL_EVENTS_VIEW: "/animals/events/[id]",
  ANIMAL_EVENTS_EDIT: "/animals/events/[id]/edit",
} satisfies Record<string, RouteId>;
