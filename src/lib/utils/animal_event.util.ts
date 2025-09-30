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

      case "injury": {
        return "-";
      }

      case "fostered": {
        return event.data.fosterer_name
          ? `By ${event.data.fosterer_name}`
          : "-";
      }

      case "adopted": {
        return event.data.adopter_name //
          ? `By ${event.data.adopter_name}`
          : "-";
      }

      case "deceased": {
        return "-";
      }

      case "walk": {
        return (
          [
            event.data.distance_meters
              ? Format.number(event.data.distance_meters / 1_000, {
                  style: "unit",
                  unit: "kilometer",
                })
              : null,
            event.data.duration_minutes
              ? Format.number(event.data.duration_minutes, {
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
