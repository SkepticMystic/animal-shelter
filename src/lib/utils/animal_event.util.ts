import type { AnimalEvent } from "$lib/server/db/schema/animal_event.model";
import { Format } from "./format.util";

export const AnimalEventUtil = {
  summarise_data: (event: Pick<AnimalEvent, "data">) => {
    switch (event.data.kind) {
      case "weighing": {
        return `Weighed ${Format.number(event.data.grams / 1_000, {
          style: "unit",
          unit: "kilogram",
        })}`;
      }
      case "vaccination": {
        return `Received '${event.data.vaccine_name}'`;
      }

      case "spay-neuter": {
        return "-";
      }

      default: {
        return "-";
      }
    }
  },
};
