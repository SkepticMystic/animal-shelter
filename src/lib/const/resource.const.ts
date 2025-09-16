/** Represents the tables users can interact with */

const KIND_IDS = ["animal", "shelter", "animal_event"] as const;
const KIND_MAP = {
  animal: { label: "Animal" },
  shelter: { label: "Shelter" },
  animal_event: { label: "Animal Event" },
} satisfies Record<IResource.KindId, { label: string }>;

export const RESOURCES = {
  KIND: {
    IDS: KIND_IDS,
    MAP: KIND_MAP,
  },
};

export declare namespace IResource {
  type KindId = (typeof KIND_IDS)[number];
}
