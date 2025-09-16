import {
  delete_shelter_remote,
  update_shelter_remote,
} from "$lib/remote/shelter.remote";
import type { ShelterSchema } from "$lib/server/db/schema/shelter.model";
import { Client } from "./index.client";

export const ShelterClient = {
  // NOTE: create happens in the auth.organzationHooks.afterCreate

  update: (shelter_id: string, update: ShelterSchema.Update) =>
    Client.request(() => update_shelter_remote({ id: shelter_id, update }), {
      toast: { success: "Shelter updated" },
    }),

  delete: (shelter_id: string) =>
    Client.request(
      async () => {
        const res = await delete_shelter_remote(shelter_id);
        if (res.ok) {
          // TODO: Improve this
          location.reload();
        }

        return res;
      },
      {
        confirm: "Are you sure you want to delete this shelter?",
        toast: { success: "Shelter deleted" },
      },
    ),
};
