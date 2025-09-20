import { microchip_lookup_remote } from "$lib/remote/microchip_lookup/microchip_lookup.remote";
import type { MicrochipLookupInput } from "$lib/schema/microchip_lookup.schema";
import { Client } from "./index.client";

export const MicrochipLookupClient = {
  lookup: (input: MicrochipLookupInput["Input"]) =>
    Client.request(() => microchip_lookup_remote(input)),
};
