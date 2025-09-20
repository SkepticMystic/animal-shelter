import type { SelectOption } from "$lib/interfaces";
import type { animal_event_data_schema } from "$lib/schema/animal_event.schema";
import type { MicrochipNumber } from "$lib/schema/microchip_lookup.schema";
import type { z } from "better-auth";
import type { ClassValue } from "svelte/elements";

const KIND_IDS = [
  "weigh", //
  "vaccine", //
  "sterilise",
  "microchip",
] as const;

const KIND_MAP = {
  weigh: {
    label: "Weighing",
    icon: "lucide/scale",
  },
  vaccine: {
    label: "Vaccination",
    icon: "lucide/syringe",
  },
  sterilise: {
    label: "Sterilisation",
    icon: "lucide/scissors",
  },
  microchip: {
    label: "Microchip",
    icon: "lucide/microchip",
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
      weigh: {
        kind: "weigh",
        grams: 1000,
      },
      vaccine: {
        kind: "vaccine",
        vaccine_name: "",
      },
      sterilise: {
        kind: "sterilise",
      },
      microchip: {
        kind: "microchip",
        microchip_number: "" as MicrochipNumber,
      },
    } satisfies {
      [K in IAnimalEvents.Kind]: Extract<
        z.input<typeof animal_event_data_schema>,
        { kind: K }
      >;
    },
  },
};

export declare namespace IAnimalEvents {
  type Kind = (typeof KIND_IDS)[number];
}
