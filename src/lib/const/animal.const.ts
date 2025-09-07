const SPECIES_IDS = ["dog", "cat"] as const;
const SPECIES_MAP = {
  dog: { label: "Dog" },
  cat: { label: "Cat" },
} satisfies Record<(typeof SPECIES_IDS)[number], { label: string }>;

export const ANIMALS = {
  SPECIES: {
    IDS: SPECIES_IDS,
    MAP: SPECIES_MAP,
    OPTIONS: SPECIES_IDS.map((id) => ({
      value: id,
      label: SPECIES_MAP[id].label,
    })),
  },
};
