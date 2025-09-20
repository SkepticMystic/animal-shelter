import { command } from "$app/server";
import { get_session } from "$lib/auth/server";
import { microchip_lookup_input_schema } from "$lib/schema/microchip_lookup.schema";
import { MicrochipLookupLive } from "$lib/services/microchip_lookup/microchip_lookup.service";
import { err } from "$lib/utils/result.util";

export const microchip_lookup_remote = command(
  microchip_lookup_input_schema,
  async (input) => {
    const session = await get_session({
      member_permissions: { microchip_lookup: ["create"] },
    });
    if (!session.session.org_id) {
      return err({ message: "Forbidden", status: 403 });
    }

    return MicrochipLookupLive.lookup(input);
  },
);
