import { MICROCHIP_LOOKUP_FINDMYCHIP_API_KEY } from "$env/static/private";
import type { IMicrochipLookup } from "$lib/const/microchip_lookup.const";
import type { MicrochipLookupInput } from "$lib/schema/microchip_lookup.schema";
import type { Animal } from "$lib/server/db/schema/animal.model";
import type { APIResult } from "$lib/utils/form.util";
import { Log } from "$lib/utils/logger.util";
import { err, suc } from "$lib/utils/result.util";
import { parseDate } from "chrono-node";
import { Context, Effect, pipe } from "effect";
import ky, { HTTPError } from "ky";
import {
  ExternalMicrochipLookupService,
  type MicrochipLookupResult,
} from "./abstract.external.service";

const DATABASE_IDS = [
  "agrichip",
  "communipet",
  "getMeKnown",
  "identipet",
  "virbac",
  "fivestarId",
] as const;

type DatabaseId = (typeof DATABASE_IDS)[number];

type DatabaseResponse = {
  status: number;
  message?: string;
  response_time: string;

  data: {
    animal_data?: MicrochipDataAnimal;
    // NOTE: I don't seem to get these two fields back from the API
    // Makes sense, PII and all that
    owner_data?: MicrochipDataOwner;
    other_contacts?: MicrochipDataOtherContact[];
  };
};

type MicrochipDataAnimal = {
  name: string;
  species: string;
  breed: string;
  description: string;
  gender: string;
  microchip_number: string;
  implant_date: string;
  microchip_implanter: string;
};

type MicrochipDataOwner = {
  first_name: string;
  last_name: string;
  cell_number: string;
  email: string;
};

type MicrochipDataOtherContact = {
  first_name: string;
  last_name: string;
  cell_number: string;
  email: string;
};

type LookupResult = {
  /** "2.25s" */
  result_time: string;

  databases: Partial<Record<DatabaseId, DatabaseResponse>>;
};

const DATABASE_ID_MAP: Record<DatabaseId, IMicrochipLookup.DatabaseId> = {
  agrichip: "agrichip",
  communipet: "communipet",
  getMeKnown: "getmeknown",
  fivestarId: "fivestarid",
  identipet: "identipet",
  virbac: "virbac",
};

const GENDER_ID_MAP: Partial<Record<string, Animal["gender"]>> = {
  m: "m",
  f: "f",
  male: "m",
  female: "f",
};

const SPECIES_ID_MAP: Partial<Record<string, Animal["species"]>> = {
  dog: "dog",
  cat: "cat",
  canine: "dog",
  feline: "cat",
  dsh: "cat",
};

const normalise_database_response = (
  input: MicrochipLookupInput["Parsed"],
  response: DatabaseResponse,
): MicrochipLookupResult["data"] => {
  const animal = response.data.animal_data;

  if (!animal?.microchip_number) {
    return { found: false };
  } else if (input.microchip_number !== animal.microchip_number) {
    // Ignore fuzzy matches for now
    return { found: false };
  }

  return response.status === 200
    ? {
        found: true,

        animal: {
          name: animal?.name || undefined,
          breed: animal?.breed || undefined,
          description: animal?.description || undefined,

          gender: animal?.gender
            ? GENDER_ID_MAP[animal.gender.toLowerCase()]
            : undefined,

          species: animal?.species
            ? SPECIES_ID_MAP[animal.species.toLowerCase()]
            : undefined,
        },

        animal_event: {
          administered_by_name: animal?.microchip_implanter || undefined,
          timestamp: animal?.implant_date
            ? (parseDate(animal?.implant_date) ?? undefined)
            : undefined,

          data: {
            kind: "microchip",
            microchip_number: input.microchip_number,
          },
        },
      }
    : { found: false };
};

const inner_lookup = async (
  input: MicrochipLookupInput["Parsed"],
): Promise<APIResult<MicrochipLookupResult[]>> =>
  ky
    // TOD: Rather zod parse the result than casting
    // Once done, I won't need to pass input.microchip_number to get a branded type
    // I can actually pass the database result
    .get<LookupResult>(
      `https://pb.findmychip.co.za/api/microchip/${input.microchip_number}`,
      {
        headers: {
          Authorization: `Bearer ${MICROCHIP_LOOKUP_FINDMYCHIP_API_KEY}`,
        },
      },
    )
    .json()
    .then((response) =>
      suc(
        DATABASE_IDS.flatMap((db_id) => {
          const database_response = response.databases[db_id];
          if (!database_response) return [];

          const data = normalise_database_response(input, database_response);

          return [
            {
              data,
              response: database_response,
              database_id: DATABASE_ID_MAP[db_id],
              aggregator_id: "findmychip" as const,
            },
          ];
        }),
      ),
    );

const implementation: Context.Tag.Service<ExternalMicrochipLookupService> = {
  lookup: (input) =>
    pipe(
      Effect.tryPromise({
        try: () => inner_lookup(input),

        catch: (error) => {
          if (error instanceof HTTPError) {
            error.response
              .json()
              .then((json) =>
                Log.error(
                  { json, message: error.message },
                  "[findmychip.microchip_lookup] error:",
                ),
              )
              .catch(() =>
                Log.error(
                  { message: error.message },
                  "[findmychip.microchip_lookup] error: (failed to parse JSON)",
                ),
              );

            return err({
              message: `Microchip lookup service error: ${error.message}`,
            });
          } else {
            Log.error(error, "[findmychip.microchip_lookup] unexpected error");

            return err({ message: "Failed to lookup microchip" });
          }
        },
      }),

      Effect.catchAll((e) => Effect.succeed(e)),
    ),
};

export const ExternalMicrochipLookupLive =
  ExternalMicrochipLookupService.of(implementation);
