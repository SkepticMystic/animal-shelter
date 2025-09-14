import type { SelectOption } from "$lib/interfaces";
import type { animal_event_data_schema } from "$lib/schema/animal_event.schema";
import type { z } from "better-auth";
import type { ClassValue } from "svelte/elements";

const KIND_IDS = [
  "weighing", //
  "vaccination", //
  "spay-neuter",
] as const;

const KIND_MAP = {
  weighing: {
    label: "Weighing",
    icon: "lucide/scale",
  },
  vaccination: {
    label: "Vaccination",
    icon: "lucide/syringe",
  },
  "spay-neuter": {
    label: "Spay/Neuter",
    icon: "lucide/scissors",
  },
} satisfies {
  [K in IAnimalEvents.Kind]: {
    label: string;
    icon: ClassValue;
  };
};

export const ANIMAL_EVENTS = {
  KINDS: {
    IDS: KIND_IDS,
    MAP: KIND_MAP,
    OPTIONS: KIND_IDS.map((id) => ({
      value: id,
      label: KIND_MAP[id].label,
    })) satisfies SelectOption[],

    DEFAULT_DATA: {
      weighing: {
        kind: "weighing",
        grams: 1000,
      },
      vaccination: {
        kind: "vaccination",
        vaccine_name: "",
      },
      "spay-neuter": {
        kind: "spay-neuter",
      },
    } satisfies {
      [K in IAnimalEvents.Kind]: Extract<
        z.infer<typeof animal_event_data_schema>,
        { kind: K }
      >;
    },
  },
};

export declare namespace IAnimalEvents {
  type Kind = (typeof KIND_IDS)[number];
}
