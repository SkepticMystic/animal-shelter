import type { MicrochipLookupInput } from "$lib/schema/microchip_lookup.schema";
import { db } from "$lib/server/db/drizzle.db";
import { AnimalSchema } from "$lib/server/db/schema/animal.model";
import { AnimalEventSchema } from "$lib/server/db/schema/animal_event.model";
import {
  MicrochipLookupTable,
  type MicrochipLookup,
} from "$lib/server/db/schema/microchip_lookup.model";
import { Dates } from "$lib/utils/dates";
import type { APIResult } from "$lib/utils/form.util";
import { Log } from "$lib/utils/logger.util";
import { err, suc } from "$lib/utils/result.util";
import { sql } from "drizzle-orm";
import { Effect } from "effect";
import { ExternalMicrochipLookupService } from "./abstract.external.service";
import { ExternalMicrochipLookupLive } from "./findmychip.external.service";

const decode_cached_lookup = (lookup: MicrochipLookup): MicrochipLookup => {
  if (!lookup.data.found) {
    return lookup;
  }

  // Mainly because the animal_event.timestamp is stored in a jsonb field,
  // so pg stringifies it. We need to decode asap, so that users get the expected type
  lookup.data.animal = AnimalSchema.update.parse(lookup.data.animal);
  lookup.data.animal_event = AnimalEventSchema.update.parse(
    lookup.data.animal_event,
  );

  return lookup;
};

export const MicrochipLookupLive = {
  lookup: (
    input: MicrochipLookupInput["Parsed"],
  ): Promise<APIResult<MicrochipLookup[]>> =>
    ExternalMicrochipLookupService.pipe(
      Effect.andThen(
        async (external): Promise<APIResult<MicrochipLookup[]>> => {
          const cached = await db.query.microchip_lookup.findMany({
            where: (table, { eq, and, gte }) =>
              and(
                gte(table.updatedAt, Dates.add_days(-1)), // TTL
                eq(table.microchip_number, input.microchip_number),
              ),
          });

          if (cached.length) {
            Log.debug(input, "MicrochipLookupService.lookup cache hit");
            return suc(cached.map(decode_cached_lookup));
          } else {
            Log.debug(input, "MicrochipLookupService.lookup cache miss");
          }

          const fresh = await Effect.runPromise(external.lookup(input));
          if (!fresh.ok) return fresh;

          try {
            const results = await db
              .insert(MicrochipLookupTable)
              .values(
                fresh.data.map((result) => ({
                  ...result,
                  microchip_number: input.microchip_number,
                })),
              )
              // SOURCE: https://orm.drizzle.team/docs/guides/upsert
              .onConflictDoUpdate({
                target: [
                  MicrochipLookupTable.microchip_number,
                  MicrochipLookupTable.database_id,
                ],
                set: {
                  updatedAt: new Date(),
                  data: sql.raw(`excluded.${MicrochipLookupTable.data.name}`),
                  response: sql.raw(
                    `excluded.${MicrochipLookupTable.response.name}`,
                  ),
                },
              })
              .returning();

            return suc(results.map(decode_cached_lookup));
          } catch (error) {
            Log.error(error, "MicrochipLookupService.lookup db upsert failure");
            return err({ message: "Database error" });
          }
        },
      ),

      Effect.provideService(
        ExternalMicrochipLookupService,
        ExternalMicrochipLookupLive,
      ),

      Effect.catchAll((_error) =>
        Effect.succeed(err({ message: "Failed to lookup microchip" })),
      ),

      Effect.runPromise,
    ),
};
