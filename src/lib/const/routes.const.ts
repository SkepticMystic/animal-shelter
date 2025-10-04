import type { RouteId } from "$app/types";
import type { ClassValue } from "svelte/elements";

export const ROUTES = {
  HOME: "/",

  ADMIN: "/admin",
  ADMIN_USERS: "/admin/users",

  AUTH: "/auth",
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

  CONTACT: "/contact",
  ROBOTS: "/robots.txt",
  SITEMAP: "/sitemap.xml",

  SHELTERS: "/shelters",
  SHELTERS_VIEW: "/shelters/[short_id]",

  ANIMALS: "/animals",
  ANIMALS_VIEW: "/animals/[short_id]",

  SHELTER: "/s",
  SHELTER_EDIT: "/s/edit",
  SHELTER_ANIMALS: "/s/animals",
  SHELTER_ANIMALS_VIEW: "/s/animals/[short_id]",
  SHELTER_ANIMALS_CREATE: "/s/animals/create",
  SHELTER_ANIMALS_EDIT: "/s/animals/[short_id]/edit",

  SHELTER_ANIMAL_EVENTS: "/s/animals/events",
  SHELTER_ANIMAL_EVENTS_CREATE: "/s/animals/events/create",
  SHELTER_ANIMAL_EVENTS_VIEW: "/s/animals/events/[id]",
  SHELTER_ANIMAL_EVENTS_EDIT: "/s/animals/events/[id]/edit",
} satisfies Record<string, RouteId>;

export const ROUTE_MAP = {
  [ROUTES.HOME]: {
    label: "Home",
    icon: "lucide/home",
  },
  [ROUTES.ADMIN]: {
    label: "Admin",
    icon: "lucide/shield-check",
  },
  [ROUTES.ADMIN_USERS]: {
    label: "Users",
    icon: "lucide/users",
  },
  [ROUTES.ANIMALS]: {
    label: "Animals",
    icon: "lucide/paw",
  },
  [ROUTES.ANIMALS_VIEW]: {
    label: "Animal Details",
    icon: "lucide/paw",
  },
  [ROUTES.AUTH]: {
    label: "Authentication",
    icon: "lucide/shield-check",
  },
  [ROUTES.AUTH_DIRECT_USER]: {
    label: "Direct User",
    icon: "lucide/user-check",
  },
  [ROUTES.AUTH_FORGOT_PASSWORD]: {
    label: "Forgot Password",
    icon: "lucide/key",
  },
  [ROUTES.AUTH_ORGANIZATION]: {
    label: "Select Organization",
    icon: "lucide/users",
  },
  [ROUTES.AUTH_ORGANIZATION_ACCEPT_INVITE]: {
    label: "Accept Invite",
    icon: "lucide/users",
  },
  [ROUTES.AUTH_ORGANIZATION_CREATE]: {
    label: "Create Organization",
    icon: "lucide/user-plus",
  },
  [ROUTES.AUTH_RESET_PASSWORD]: {
    label: "Reset Password",
    icon: "lucide/key",
  },
  [ROUTES.AUTH_SIGNIN]: {
    label: "Sign In",
    icon: "lucide/log-in",
  },
  [ROUTES.AUTH_SIGNUP]: {
    label: "Sign Up",
    icon: "lucide/user-plus",
  },
  [ROUTES.AUTH_VERIFY_EMAIL]: {
    label: "Verify Email",
    icon: "lucide/mail",
  },
  [ROUTES.CONTACT]: {
    label: "Contact",
    icon: "lucide/mail",
  },
  [ROUTES.PROFILE]: {
    label: "Profile",
    icon: "lucide/user",
  },
  [ROUTES.ROBOTS]: {
    label: "Robots",
    icon: "lucide/robot",
  },
  [ROUTES.SHELTER]: {
    label: "Shelter",
    icon: "lucide/home",
  },
  [ROUTES.SHELTER_ANIMALS]: {
    label: "Animals",
    icon: "lucide/paw",
  },
  [ROUTES.SHELTER_ANIMALS_VIEW]: {
    label: "Animal Details",
    icon: "lucide/paw",
  },
  [ROUTES.SHELTER_ANIMALS_EDIT]: {
    label: "Edit Animal",
    icon: "lucide/edit-3",
  },
  [ROUTES.SHELTER_ANIMALS_CREATE]: {
    label: "Add Animal",
    icon: "lucide/paw",
  },
  [ROUTES.SHELTER_ANIMAL_EVENTS]: {
    label: "Animal Events",
    icon: "lucide/calendar",
  },
  [ROUTES.SHELTER_ANIMAL_EVENTS_VIEW]: {
    label: "Animal Event Details",
    icon: "lucide/calendar",
  },
  [ROUTES.SHELTER_ANIMAL_EVENTS_EDIT]: {
    label: "Edit Animal Event",
    icon: "lucide/edit-3",
  },
  [ROUTES.SHELTER_ANIMAL_EVENTS_CREATE]: {
    label: "Add Animal Event",
    icon: "lucide/calendar",
  },
  [ROUTES.SHELTER_EDIT]: {
    label: "Edit Shelter",
    icon: "lucide/edit-3",
  },
  [ROUTES.SHELTERS]: {
    label: "Shelters",
    icon: "lucide/home",
  },
  [ROUTES.SHELTERS_VIEW]: {
    label: "Shelter Details",
    icon: "lucide/home",
  },
  [ROUTES.SITEMAP]: {
    label: "Sitemap",
    icon: "lucide/map",
  },
} satisfies Record<
  RouteId,
  {
    label: string;
    icon: ClassValue;
  }
>;
