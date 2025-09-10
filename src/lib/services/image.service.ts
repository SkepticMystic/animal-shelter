import { db } from "$lib/server/db/drizzle.db";
import { ImageTable, type Image } from "$lib/server/db/schema/image.model";
import type { APIResult } from "$lib/utils/form.util";
import { err, suc } from "$lib/utils/result.util";
import { and, eq } from "drizzle-orm";
import { Effect } from "effect";
import { ImageHostLive } from "./image_hosting.service";

export const ImageService = {
  upload: async (
    file: File,
    input: Pick<Image, "blurhash" | "resource_id" | "resource_kind" | "org_id">,
  ) => {
    const resource = await db.query[input.resource_kind].findFirst({
      columns: { id: true },

      where: (res, { eq, and }) =>
        and(
          eq(res.org_id, input.org_id), //
          eq(res.id, input.resource_id),
        ),
    });
    if (!resource) {
      return err({ message: "Referenced resource not found", status: 404 });
    }

    const upload = await Effect.runPromise(ImageHostLive.upload({ file }));
    console.log("Image upload result:", upload);
    if (!upload.ok) return upload;

    try {
      const [image] = await db
        .insert(ImageTable)
        .values({
          url: upload.data.url,
          org_id: input.org_id,
          blurhash: input.blurhash,
          resource_id: input.resource_id,
          resource_kind: input.resource_kind,
          provider: ImageHostLive.provider,
          external_id: upload.data.external_id,
        })
        .returning();

      return suc(image);
    } catch (error) {
      console.error("Database insertion error:", error);

      return err({ message: "Failed to save image record" });
    }
  },

  delete: async (
    input: Partial<Pick<Image, "id" | "resource_id" | "resource_kind">> & {
      org_id: string;
    },
  ): Promise<APIResult<null>> => {
    const where = and(
      eq(ImageTable.org_id, input.org_id),

      input.id //
        ? eq(ImageTable.id, input.id)
        : undefined,
      input.resource_id
        ? eq(ImageTable.resource_id, input.resource_id)
        : undefined,
      input.resource_kind
        ? eq(ImageTable.resource_kind, input.resource_kind)
        : undefined,
    );

    const images = await db.query.image.findMany({
      where,
      columns: { external_id: true, org_id: true },
    });

    if (images.length === 0) {
      return err({ message: "Image(s) not found", status: 404 });
    }

    await Promise.all([
      db.delete(ImageTable).where(where),

      ...images.map((image) =>
        Effect.runPromise(ImageHostLive.delete(image.external_id)),
      ),
    ]);

    return suc(null);
  },
};
