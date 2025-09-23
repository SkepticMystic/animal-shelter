import { update_shelter_remote } from "$lib/remote/shelter.remote";
import type { ShelterSchema } from "$lib/server/db/schema/shelter.model";
import { Client } from "./index.client";

export const ShelterClient = {
  // NOTE: create happens in the auth.organzationHooks.afterCreate

  update: (shelter_id: string, update: ShelterSchema.Update) =>
    Client.request(() => update_shelter_remote({ id: shelter_id, update }), {
      toast: { success: "Shelter updated" },
    }),
};
