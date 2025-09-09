import { delete_image_remote } from "$lib/remote/image.remote";
import { Client } from "./index.client";

export const ImageClient = {
  delete: (image_id: string) =>
    Client.request(() => delete_image_remote(image_id), {
      confirm:
        "Are you sure you want to delete this image? This action cannot be undone.",
      toast: { success: "Image deleted" },
    }),
};
