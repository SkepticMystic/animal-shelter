import type { ClassValue } from "svelte/elements";

const PROVIDER_IDS = ["google"] as const;
const PROVIDER_MAP = {
  google: {
    label: "Google",
    icon: "mdi/google",
  },
} satisfies Record<
  (typeof PROVIDER_IDS)[number],
  {
    label: string;
    icon: ClassValue;
  }
>;

export const PLACES = {
  PROVIDER: {
    IDS: PROVIDER_IDS,
    MAP: PROVIDER_MAP,
  },
};
