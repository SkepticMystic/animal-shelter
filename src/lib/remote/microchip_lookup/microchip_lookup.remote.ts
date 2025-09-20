import { command } from "$app/server";
import { get_session } from "$lib/auth/server";
import { microchip_lookup_input_schema } from "$lib/schema/microchip_lookup.schema";
import { MicrochipLookupLive } from "$lib/services/microchip_lookup/findmychip.microchip_lookup.implementation";
import type { MicrochipLookupResult } from "$lib/services/microchip_lookup/microchip_lookup.service";
import type { APIResult } from "$lib/utils/form.util";
import { err } from "$lib/utils/result.util";
import { Effect } from "effect";

export const microchip_lookup_remote = command(
  microchip_lookup_input_schema,
  async (input): Promise<APIResult<MicrochipLookupResult[]>> => {
    const session = await get_session({
      member_permissions: { microchip_lookup: ["create"] },
    });
    if (!session.session.org_id) {
      return err({ message: "Forbidden", status: 403 });
    }

    const result = await Effect.runPromise(MicrochipLookupLive.lookup(input));

    return result;
  },
);
