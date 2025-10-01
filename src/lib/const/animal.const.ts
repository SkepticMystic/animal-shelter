import type { BadgeVariant } from "$lib/components/ui/badge";
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
    variant: "default",
  },
  fostered: {
    label: "Fostered",
    variant: "secondary",
  },
  adopted: {
    label: "Adopted",
    variant: "outline",
  },
  deceased: {
    label: "Deceased",
    variant: "destructive",
  },
} satisfies Record<
  (typeof STATUS_IDS)[number],
  {
    label: string;
    // NOTE: icons seem a little distasteful here...
    // icon: ClassValue;
    variant: BadgeVariant;
  }
>;

const TRAIT_IDS = [
  "friendly",
  "kids:good",
  "dogs:good",
  "cats:good",
  "house_trained",
  "energy:low",
  "energy:high",
] as const;

const TRAIT_MAP = {
  friendly: {
    label: "Friendly",
    icon: "lucide/smile-plus",
  },
  "kids:good": {
    label: "Good with kids",
    icon: "lucide/baby",
  },
  "dogs:good": {
    label: "Good with dogs",
    icon: "lucide/dog-bowl",
  },
  "cats:good": {
    label: "Good with cats",
    icon: "lucide/cat",
  },
  house_trained: {
    label: "House trained",
    icon: "lucide/home",
  },
  "energy:low": {
    label: "Low energy",
    icon: "lucide/sleep",
  },
  "energy:high": {
    label: "High energy",
    icon: "lucide/flash",
  },
} satisfies Record<
  (typeof TRAIT_IDS)[number],
  { label: string; icon: ClassValue }
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

  TRAITS: {
    IDS: TRAIT_IDS,
    MAP: TRAIT_MAP,
    OPTIONS: TRAIT_IDS.map((id) => ({
      value: id,
      label: TRAIT_MAP[id].label,
    })) satisfies SelectOption[],
  },
};
