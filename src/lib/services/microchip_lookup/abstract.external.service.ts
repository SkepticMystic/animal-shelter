import type { IMicrochipLookup } from "$lib/const/microchip_lookup.const";
import type { MicrochipLookupInput } from "$lib/schema/microchip_lookup.schema";
import type { AnimalSchema } from "$lib/server/db/schema/animal.model";
import type { AnimalEventSchema } from "$lib/server/db/schema/animal_event.model";
import type { APIResult } from "$lib/utils/form.util";
import { Context, Effect } from "effect";

export type MicrochipLookupResult = {
  database_id: IMicrochipLookup.DatabaseId;
  aggregator_id?: IMicrochipLookup.AggregatorId | null;

  response: unknown;
  data:
    | {
        found: false;

        animal?: undefined;
        animal_event?: undefined;
      }
    | {
        found: true;

        animal: AnimalSchema.UpdateOut;
        animal_event: AnimalEventSchema.UpdateOut;
      };
};

export class ExternalMicrochipLookupService extends Context.Tag(
  "ExternalMicrochipLookupService",
)<
  ExternalMicrochipLookupService,
  {
    readonly lookup: (
      input: MicrochipLookupInput["Parsed"],
    ) => Effect.Effect<APIResult<MicrochipLookupResult[]>>;
  }
>() {}
