import sharp from "sharp";
import { rgbaToThumbHash } from "thumbhash";
import type { APIResult } from "../form.util";
import { err, suc } from "../result.util";

export const Thumbhash = {
  generate: async (file: File): Promise<APIResult<string>> => {
    try {
      console.time("Thumbhash.generate");

      const buffer = await file.arrayBuffer();

      const image = sharp(buffer).resize(100, 100, { fit: "inside" });

      const { data, info } = await image
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });

      const binary_thumbhash = rgbaToThumbHash(info.width, info.height, data);
      console.timeLog("Thumbhash.generate", "binary_thumbhash");

      const base64 = Buffer.from(binary_thumbhash).toString("base64");

      console.timeEnd("Thumbhash.generate");
      return suc(base64);
    } catch (error) {
      console.error(error, "Error generating thumbhash:");
      return err({ message: "Error generating thumbhash" });
    }
  },
};
