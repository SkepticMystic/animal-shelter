import {
  create_animal_remote,
  update_animal_remote,
} from "$lib/remote/animal.remote";
import type { AnimalSchema } from "$lib/server/db/schema/animal.model";
import { Client } from "./index.client";

export const AnimalClient = {
  create: (input: AnimalSchema.Insert) =>
    Client.request(() => create_animal_remote(input), {
      toast: { success: "Animal created" },
    }),

  update: (id: string, update: AnimalSchema.Update) =>
    Client.request(() => update_animal_remote({ id, update }), {
      toast: { success: "Animal updated" },
    }),
};
