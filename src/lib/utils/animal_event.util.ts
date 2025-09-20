import type { AnimalEvent } from "$lib/server/db/schema/animal_event.model";
import { Format } from "./format.util";

export const AnimalEventUtil = {
  summarise_data: (event: Pick<AnimalEvent, "data">) => {
    switch (event.data.kind) {
      case "weigh": {
        return `Weighed ${Format.number(event.data.grams / 1_000, {
          style: "unit",
          unit: "kilogram",
        })}`;
      }
      case "vaccine": {
        return `Received "${event.data.vaccine_name}"`;
      }

      case "sterilise": {
        return "-";
      }

      case "microchip": {
        return `No: ${event.data.microchip_number}`;
      }

      default: {
        return "UNHANDLED";
      }
    }
  },
};
