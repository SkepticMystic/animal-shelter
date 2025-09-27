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
  "walk",
  "injury",
  "fostered",
  "adopted",
  "deceased",
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
  walk: {
    label: "Walk",
    icon: "lucide/shoe-print",
  },
  injury: {
    label: "Injury",
    icon: "lucide/first-aid",
  },
  fostered: {
    label: "Fostered",
    icon: "lucide/house-heart",
  },
  adopted: {
    label: "Adopted",
    icon: "lucide/heart-handshake",
  },
  deceased: {
    label: "Deceased",
    icon: "lucide/cross",
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
      walk: {
        kind: "walk",
      },
      injury: {
        kind: "injury",
      },
      fostered: {
        kind: "fostered",
      },
      adopted: {
        kind: "adopted",
      },
      deceased: {
        kind: "deceased",
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
