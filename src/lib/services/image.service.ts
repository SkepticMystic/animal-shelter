import { CLOUDINARY_API_SECRET } from "$env/static/private";
import {
  PUBLIC_CLOUDINARY_API_KEY,
  PUBLIC_CLOUDINARY_CLOUD_NAME,
  PUBLIC_CLOUDINARY_UPLOAD_PRESET,
} from "$env/static/public";
import type { IImage } from "$lib/const/image.const";
import type { Result } from "$lib/interfaces";
import type { Image } from "$lib/server/db/schema/image.model";
import { err, suc } from "$lib/utils/result.util";
import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";
import { Context, Effect } from "effect";

export type UploadImageOptions = {
  file: File;
};

export class ImageService extends Context.Tag("ImageService")<
  ImageService,
  {
    readonly provider: IImage.ProviderId;

    readonly upload: (
      input: UploadImageOptions,
    ) => Effect.Effect<
      Result<Pick<Image, "url" | "external_id">, { message: string }>
    >;

    readonly delete: (
      external_id: string,
    ) => Effect.Effect<Result<null, { message: string }>>;
  }
>() {}

cloudinary.config({
  api_secret: CLOUDINARY_API_SECRET,
  api_key: PUBLIC_CLOUDINARY_API_KEY,
  cloud_name: PUBLIC_CLOUDINARY_CLOUD_NAME,
});

const of_cloudinary: Context.Tag.Service<ImageService> = {
  provider: "cloudinary",

  upload: ({ file }) =>
    Effect.tryPromise({
      try: async () => {
        const array_buffer = await file.arrayBuffer();
        const buffer = Buffer.from(array_buffer);

        const res: UploadApiResponse | undefined = await new Promise(
          (resolve, reject) => {
            cloudinary.uploader
              .upload_stream(
                {
                  resource_type: "image",
                  upload_preset: PUBLIC_CLOUDINARY_UPLOAD_PRESET,
                },
                (error, result) => (error ? reject(error) : resolve(result)),
              )
              .end(buffer);
          },
        );

        console.log("Upload result:", res);
        if (!res) {
          return err({ message: "No response from Cloudinary" });
        } else {
          return suc({
            url: res.secure_url,
            external_id: res.public_id,
          });
        }
      },

      catch: (error) => {
        console.error("Failed to upload image:", error);

        return err({ message: "Failed to upload image" });
      },
    }) //
      .pipe(Effect.catchAll((e) => Effect.succeed(e))),

  delete: (external_id) =>
    Effect.tryPromise({
      try: async () => {
        const res = await cloudinary.uploader
          .destroy(external_id, { resource_type: "image" })
          .then((result) => {
            if (result?.result !== "ok" && result?.result !== "not found") {
              return Promise.reject(result);
            }
          });

        return suc(null);
      },

      catch: (error) => {
        console.error("Failed to delete image:", error);
        return err({ message: "Failed to delete image" });
      },
    }) //
      .pipe(Effect.catchAll((e) => Effect.succeed(e))),
};

export const ImageLive = ImageService.of(of_cloudinary);
