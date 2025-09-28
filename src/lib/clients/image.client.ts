import { delete_image_remote } from "$lib/remote/image.remote";
import type { Image } from "$lib/server/db/schema/image.model";
import { thumbHashToDataURL } from "thumbhash";
import { Client } from "./index.client";

export const ImageClient = {
  delete: (image_id: string) =>
    Client.request(() => delete_image_remote(image_id), {
      confirm:
        "Are you sure you want to delete this image? This action cannot be undone.",
      toast: { success: "Image deleted" },
    }),

  // SOURCE: https://github.com/evanw/thumbhash/blob/main/examples/browser/index.html
  decode_thumbhash: (image?: Pick<Image, "thumbhash">) =>
    image?.thumbhash
      ? thumbHashToDataURL(
          new Uint8Array(
            atob(image.thumbhash)
              .split("")
              .map((x) => x.charCodeAt(0)),
          ),
        )
      : undefined,
};
