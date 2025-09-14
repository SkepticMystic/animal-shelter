import type { ClassValue } from "svelte/elements";

const SOCIAL_IDS = [
  "facebook",
  "twitter",
  "linkedin",
  "whatsapp",
  "telegram",
  "reddit",
  "pinterest",
] as const;

const SOCIAL_MAP = {
  facebook: {
    label: "Facebook",
    icon: "mdi/facebook",
  },
  twitter: {
    label: "Twitter",
    icon: "mdi/twitter",
  },
  linkedin: {
    label: "LinkedIn",
    icon: "mdi/linkedin",
  },
  whatsapp: {
    label: "WhatsApp",
    icon: "mdi/whatsapp",
  },
  telegram: {
    label: "Telegram",
    icon: "mdi/telegram",
  },
  reddit: {
    label: "Reddit",
    icon: "mdi/reddit",
  },
  pinterest: {
    label: "Pinterest",
    icon: "mdi/pinterest",
  },
} satisfies Record<
  (typeof SOCIAL_IDS)[number],
  {
    label: string;
    icon: ClassValue;
  }
>;

export const SHARE = {
  SOCIAL: {
    IDS: SOCIAL_IDS,
    MAP: SOCIAL_MAP,
  },
};
