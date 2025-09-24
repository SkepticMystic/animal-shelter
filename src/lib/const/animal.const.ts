import type { SelectOption } from "$lib/interfaces";
import type { ClassValue } from "svelte/elements";

const SPECIES_IDS = ["dog", "cat"] as const;
const SPECIES_MAP = {
  dog: {
    label: "Dog",
    icon: "lucide/dog",
  },
  cat: {
    label: "Cat",
    icon: "lucide/cat",
  },
} satisfies Record<
  (typeof SPECIES_IDS)[number],
  {
    label: string;
    icon: ClassValue;
  }
>;

const GENDER_IDS = ["m", "f", "u"] as const;
const GENDER_MAP = {
  m: {
    label: "Male",
    icon: "lucide/mars",
  },
  f: {
    label: "Female",
    icon: "lucide/venus",
  },
  u: {
    label: "Unknown",
    icon: "lucide/question-mark",
  },
} satisfies Record<
  (typeof GENDER_IDS)[number],
  { label: string; icon: ClassValue }
>;

const STATUS_IDS = [
  /** At the shelter, ready for adoption */
  "available",
  /** Out on foster */
  "fostered",
  /** Has been adopted */
  "adopted",
  /** Euthanised, died */
  "deceased",
] as const;

const STATUS_MAP = {
  available: {
    label: "Available",
  },
  fostered: {
    label: "Fostered",
  },
  adopted: {
    label: "Adopted",
  },
  deceased: {
    label: "Deceased",
  },
} satisfies Record<
  (typeof STATUS_IDS)[number],
  {
    label: string;
    // NOTE: icons seem a little distasteful here...
    // icon: ClassValue;
  }
>;

export const ANIMALS = {
  SPECIES: {
    IDS: SPECIES_IDS,
    MAP: SPECIES_MAP,
    OPTIONS: SPECIES_IDS.map((id) => ({
      value: id,
      label: SPECIES_MAP[id].label,
    })) satisfies SelectOption[],
  },

  GENDER: {
    IDS: GENDER_IDS,
    MAP: GENDER_MAP,
    OPTIONS: GENDER_IDS.map((id) => ({
      value: id,
      label: GENDER_MAP[id].label,
    })) satisfies SelectOption[],
  },

  STATUS: {
    IDS: STATUS_IDS,
    MAP: STATUS_MAP,
    OPTIONS: STATUS_IDS.map((id) => ({
      value: id,
      label: STATUS_MAP[id].label,
    })) satisfies SelectOption[],
  },
};
