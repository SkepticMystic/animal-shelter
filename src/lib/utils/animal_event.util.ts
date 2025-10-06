import type { AnimalEvent } from "$lib/server/db/schema/animal_event.model";
import { Format } from "./format.util";

export const AnimalEventUtil = {
  summarise_data: ({ data }: Pick<AnimalEvent, "data">) => {
    switch (data.kind) {
      case "weigh": {
        return `Weighed ${Format.number(data.grams / 1_000, {
          style: "unit",
          unit: "kilogram",
        })}`;
      }
      case "vaccine": {
        return `Received "${data.vaccine_name}"`;
      }

      case "sterilise": {
        return "-";
      }

      case "microchip": {
        return `No: ${data.microchip_number}`;
      }

      case "injury": {
        return "-";
      }

      case "fostered": {
        return data.fosterer_name ? `By ${data.fosterer_name}` : "-";
      }

      case "adopted": {
        return data.adopter_name //
          ? `By ${data.adopter_name}`
          : "-";
      }

      case "deceased": {
        return "-";
      }

      case "walk": {
        return (
          [
            data.distance_meters
              ? Format.number(data.distance_meters / 1_000, {
                  style: "unit",
                  unit: "kilometer",
                })
              : null,
            data.duration_minutes
              ? Format.number(data.duration_minutes, {
                  style: "unit",
                  unit: "minute",
                })
              : null,
          ]
            .filter(Boolean)
            .join(", ") || "-"
        );
      }

      default: {
        return "UNHANDLED";
      }
    }
  },
};
