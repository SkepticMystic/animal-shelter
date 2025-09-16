import type { SelectOption } from "$lib/interfaces";
import type { ClassValue } from "svelte/elements";

const KIND_IDS = ["https", "mailto", "tel"] as const;
const KIND_MAP = {
  https: {
    label: "Website",
    icon: "lucide/globe",
  },
  mailto: {
    label: "Email",
    icon: "lucide/mail",
  },
  tel: {
    label: "Phone",
    icon: "lucide/phone",
  },
} satisfies Record<
  (typeof KIND_IDS)[number],
  { label: string; icon: ClassValue }
>;

export const LINKS = {
  KIND: {
    IDS: KIND_IDS,
    MAP: KIND_MAP,
    OPTIONS: KIND_IDS.map((id) => ({
      value: id,
      label: KIND_MAP[id].label,
    })) satisfies SelectOption[],
  },
};

export declare namespace ILink {
  type KindId = (typeof KIND_IDS)[number];
}
