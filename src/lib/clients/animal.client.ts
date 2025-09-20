import {
  create_animal_remote,
  delete_animal_remote,
  get_animals_remote,
  update_animal_remote,
} from "$lib/remote/animal.remote";
import type { AnimalSchema } from "$lib/server/db/schema/animal.model";
import { Client } from "./index.client";

export const AnimalClient = {
  create: (input: AnimalSchema.InsertIn) =>
    Client.request(
      () => create_animal_remote(input).updates(get_animals_remote({})),
      { toast: { success: "Animal created" } },
    ),

  update: (id: string, update: AnimalSchema.UpdateIn) =>
    Client.request(
      () =>
        update_animal_remote({ id, update }).updates(get_animals_remote({})),
      { toast: { success: "Animal updated" } },
    ),

  delete: (id: string) =>
    Client.request(
      () => delete_animal_remote(id).updates(get_animals_remote({})),
      {
        confirm: "Are you sure you want to delete this animal?",
        toast: { success: "Animal deleted" },
      },
    ),
};
