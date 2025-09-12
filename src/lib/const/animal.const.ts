const SPECIES_IDS = ["dog", "cat"] as const;
const SPECIES_MAP = {
  dog: { label: "Dog" },
  cat: { label: "Cat" },
} satisfies Record<(typeof SPECIES_IDS)[number], { label: string }>;

const GENDER_IDS = ["m", "f", "u"] as const;
const GENDER_MAP = {
  m: { label: "Male" },
  f: { label: "Female" },
  u: { label: "Unknown" },
} satisfies Record<(typeof GENDER_IDS)[number], { label: string }>;

export const ANIMALS = {
  SPECIES: {
    IDS: SPECIES_IDS,
    MAP: SPECIES_MAP,
    OPTIONS: SPECIES_IDS.map((id) => ({
      value: id,
      label: SPECIES_MAP[id].label,
    })),
  },

  GENDER: {
    IDS: GENDER_IDS,
    MAP: GENDER_MAP,
    OPTIONS: GENDER_IDS.map((id) => ({
      value: id,
      label: GENDER_MAP[id].label,
    })),
  },
};
