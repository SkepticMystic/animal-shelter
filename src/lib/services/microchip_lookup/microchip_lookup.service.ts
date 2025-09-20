import type { IMicrochipLookup } from "$lib/const/microchip_lookup.const";
import type { MicrochipLookupInput } from "$lib/schema/microchip_lookup.schema";
import type { Animal } from "$lib/server/db/schema/animal.model";
import type { APIResult } from "$lib/utils/form.util";
import { Context, Effect } from "effect";

export type MicrochipLookupResult = {
  database_id: IMicrochipLookup.DatabaseId;
  aggregator_id?: IMicrochipLookup.AggregatorId;

  response: unknown;
  data:
    | {
        found: false;

        animal?: undefined;
        microchip?: undefined;
      }
    | {
        found: true;

        animal: Partial<
          Pick<Animal, "name" | "species" | "breed" | "gender" | "description">
        >;

        microchip: {
          implant_date?: Date;
          microchip_number?: string;
          implanted_by_name?: string;
        };
      };
};

export class MicrochipLookupService extends Context.Tag(
  "MicrochipLookupService",
)<
  MicrochipLookupService,
  {
    readonly lookup: (
      input: MicrochipLookupInput["Parsed"],
    ) => Effect.Effect<APIResult<MicrochipLookupResult[]>>;
  }
>() {}
