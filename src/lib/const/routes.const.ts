import type { RouteId } from "$app/types";

export const ROUTES = {
  HOME: "/",

  ADMIN: "/admin",

  AUTH_SIGNUP: "/auth/signup",
  AUTH_SIGNIN: "/auth/signin",
  AUTH_DIRECT_USER: "/auth/direct-user",
  AUTH_VERIFY_EMAIL: "/auth/verify-email",
  AUTH_FORGOT_PASSWORD: "/auth/forgot-password",
  AUTH_RESET_PASSWORD: "/auth/reset-password",
  AUTH_ORGANIZATION: "/auth/organization",
  AUTH_ORGANIZATION_CREATE: "/auth/organization/create",

  AUTH_ORGANIZATION_ACCEPT_INVITE: "/auth/organization/accept-invite",

  PROFILE: "/profile",

  SHELTERS: "/shelters",
  SHELTERS_VIEW: "/shelters/[short_id]",

  ANIMALS: "/animals",
  ANIMALS_VIEW: "/animals/[short_id]",

  SHELTER: "/s",
  SHELTER_EDIT: "/s/edit",
  SHELTER_ANIMALS: "/s/animals",
  SHELTER_ANIMALS_CREATE: "/s/animals/create",
  SHELTER_ANIMALS_EDIT: "/s/animals/[short_id]/edit",

  SHELTER_ANIMAL_EVENTS: "/s/animals/events",
  SHELTER_ANIMAL_EVENTS_CREATE: "/s/animals/events/create",
  SHELTER_ANIMAL_EVENTS_VIEW: "/s/animals/events/[id]",
  SHELTER_ANIMAL_EVENTS_EDIT: "/s/animals/events/[id]/edit",
} satisfies Record<string, RouteId>;
