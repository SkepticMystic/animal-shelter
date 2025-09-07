import {
  create_animal_remote,
  patch_animal_remote,
} from "$lib/remote/animal.remote";
import type { AnimalSchema } from "$lib/schema/animal.schema";
import type { z } from "zod/mini";
import { Client } from "./index.client";

export const AnimalClient = {
  create: (input: z.input<typeof AnimalSchema.insert>) =>
    Client.request(() => create_animal_remote(input), {
      toast: { success: "Animal created" },
    }),

  patch: (id: string, patch: Partial<z.input<typeof AnimalSchema.insert>>) =>
    Client.request(() => patch_animal_remote({ id, patch }), {
      toast: { success: "Animal updated" },
    }),
};
