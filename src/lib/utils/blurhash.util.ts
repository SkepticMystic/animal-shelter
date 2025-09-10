import { encode } from "blurhash";
import type { APIResult } from "./form.util";
import { err, suc } from "./result.util";
import { IMAGES } from "$lib/const/image.const";

export const Blurhash = {
  // NOTE: Runs on the client.
  // I've seen server-side implementations, but they use heavy dependencies like canvas
  generate: async (
    file: File,
    options?: { components?: { x?: number; y?: number } },
  ): Promise<APIResult<string>> => {
    try {
      console.time("Blurhash.generate");

      const bitmap = await createImageBitmap(file);
      console.timeLog("Blurhash.generate", "ImageBitmap created");

      const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
      const context = canvas.getContext("2d");
      if (!context) return err({ message: "Could not get canvas context" });

      context.drawImage(bitmap, 0, 0);
      const image_data = context.getImageData(
        0,
        0,
        canvas.width,
        canvas.height,
      );

      console.timeLog("Blurhash.generate", "Image data extracted");

      const blurhash = encode(
        image_data.data,
        image_data.width,
        image_data.height,
        options?.components?.x ?? IMAGES.BLURHASH.COMPONENTS.X,
        options?.components?.y ?? IMAGES.BLURHASH.COMPONENTS.Y,
      );

      console.timeEnd("Blurhash.generate");

      return suc(blurhash);
    } catch (error) {
      console.error(error, "Error generating blurhash:");
      return err({ message: "Error generating blurhash" });
    }
  },
};
