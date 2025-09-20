import {
  create_animal_event_remote,
  delete_animal_event_remote,
  update_animal_event_remote,
} from "$lib/remote/animal_event/animal_event.remote";
import type { AnimalEventSchema } from "$lib/server/db/schema/animal_event.model";
import { Client } from "./index.client";

export const AnimalEventClient = {
  create: async (insert: AnimalEventSchema.InsertIn) =>
    Client.request(() => create_animal_event_remote(insert), {
      toast: { success: "Event created" },
    }),

  update: async (id: string, update: AnimalEventSchema.UpdateIn) =>
    Client.request(() => update_animal_event_remote({ id, update }), {
      toast: { success: "Event updated" },
    }),

  delete: async (id: string) =>
    Client.request(() => delete_animal_event_remote({ id }), {
      confirm: "Are you sure you want to delete this event?",
      toast: { success: "Event deleted" },
    }),
};
