import { MICROCHIP_LOOKUP } from "$lib/const/microchip_lookup.const";
import type { MicrochipLookupResult } from "$lib/services/microchip_lookup/microchip_lookup.service";

export const MicrochipLookupUtil = {
  merge_results_data: (
    results: MicrochipLookupResult[],
  ): MicrochipLookupResult["data"] => {
    const found_results = results
      .filter((r) => r.data.found)
      .sort(
        // Sorted by data quality, so their fields are preferred
        (a, b) =>
          MICROCHIP_LOOKUP.DATABASE.IDS.indexOf(a.database_id) -
          MICROCHIP_LOOKUP.DATABASE.IDS.indexOf(b.database_id),
      );

    if (found_results.length === 0) {
      return { found: false } as const;
    }

    const data: MicrochipLookupResult["data"] = {
      found: true,
      animal: {},
      microchip: {},
    };

    for (const result of found_results) {
      // NOTE: We know they're found, but TS doesn't, and the Extract<> is too complex
      if (!result.data.found) continue;

      Object.entries(result.data.animal).forEach(([key, value]) => {
        if (value && data.animal && !(key in data.animal)) {
          //@ts-expect-error: I've tried various castings, but can't get around this
          data.animal[key] = value;
        }
      });

      Object.entries(result.data.microchip).forEach(([key, value]) => {
        if (value && data.microchip && !(key in data.microchip)) {
          //@ts-expect-error: I've tried various castings, but can't get around this
          data.microchip[key] = value;
        }
      });
    }

    return data;
  },
};
