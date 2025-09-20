import { MICROCHIP_LOOKUP } from "$lib/const/microchip_lookup.const";
import type { MicrochipLookup } from "$lib/server/db/schema/microchip_lookup.model";
import { Objects } from "../objects.util";

export const MicrochipLookupUtil = {
  merge_results_data: (results: MicrochipLookup[]): MicrochipLookup["data"] => {
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

    let data = { ...found_results[0].data };

    for (const result of found_results.slice(1)) {
      // NOTE: We know they're found, but TS doesn't, and the Extract<> is too complex
      if (!result.data.found) continue;

      data = Objects.deep_merge_nullish(data, result.data);
    }

    return data;
  },
};
