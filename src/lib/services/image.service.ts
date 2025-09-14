import { IMAGES } from "$lib/const/image.const";
import { db } from "$lib/server/db/drizzle.db";
import { ImageTable, type Image } from "$lib/server/db/schema/image.model";
import type { APIResult } from "$lib/utils/form.util";
import { Format } from "$lib/utils/format.util";
import { Thumbhash } from "$lib/utils/image/thumbhash.util";
import { Log } from "$lib/utils/logger.util";
import { err, suc } from "$lib/utils/result.util";
import { and, count, eq } from "drizzle-orm";
import { Effect } from "effect";
import { ImageHostLive } from "./image_hosting.service";

const get_image_resource = async (
  input: Pick<Image, "resource_id" | "resource_kind" | "org_id">,
) => {
  switch (input.resource_kind) {
    case "organization": {
      return db.query[input.resource_kind].findFirst({
        columns: { id: true },
        where: (res, { eq, and }) =>
          and(
            eq(res.id, input.org_id), //
            // eq(res.org_id, input.org_id),
          ),
      });
    }

    case "animal": {
      return db.query[input.resource_kind].findFirst({
        columns: { id: true },
        where: (res, { eq, and }) =>
          and(
            eq(res.org_id, input.org_id), //
            eq(res.id, input.resource_id),
          ),
      });
    }

    case "animal_event": {
      return db.query[input.resource_kind].findFirst({
        columns: { id: true },
        where: (res, { eq, and }) =>
          and(
            eq(res.org_id, input.org_id), //
            eq(res.id, input.resource_id),
          ),
      });
    }

    default: {
      Log.warn(`Unsupported image resource kind: ${input.resource_kind}`);
      return undefined;
    }
  }
};

const build_image_where_clause = (
  input: Partial<Pick<Image, "id" | "resource_id" | "resource_kind">> & {
    org_id: string;
  },
) =>
  and(
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

export const ImageService = {
  get_image_resource,

  upload: async (
    file: File,
    input: Pick<Image, "resource_id" | "resource_kind" | "org_id">,
  ) => {
    if (file.size > IMAGES.LIMITS.MAX_FILE_SIZE_BYTES) {
      return err({
        status: 413,
        message: `Image exceeds size limit of ${Format.number(
          IMAGES.LIMITS.MAX_FILE_SIZE_BYTES / (1024 * 1024),
          {
            style: "unit",
            unit: "megabyte",
            unitDisplay: "long",
            maximumFractionDigits: 1,
          },
        )}`,
      });
    }

    const [resource, [existing_images]] = await Promise.all([
      get_image_resource(input),
      db
        .select({ count: count(ImageTable.id) })
        .from(ImageTable)
        .where(build_image_where_clause(input))
        .groupBy(ImageTable.resource_id),
    ]);

    if (!resource) {
      return err({ message: "Referenced resource not found", status: 404 });
    } else if (
      // NOTE: If there are no images, existing_images will be undefined
      existing_images &&
      existing_images.count >= IMAGES.LIMITS.MAX_COUNT.PER_RESOURCE
    ) {
      return err({
        status: 429,
        message: `Image limit reached for this ${input.resource_kind} (${IMAGES.LIMITS.MAX_COUNT.PER_RESOURCE}). Please delete existing images before uploading more`,
      });
    }

    const [upload, thumbhash] = await Promise.all([
      Effect.runPromise(ImageHostLive.upload({ file })),
      // NOTE: Calling this second in line seems to help with the timeout issue
      Thumbhash.generate(file),
    ]);
    if (!upload.ok) return upload;

    try {
      const [image] = await db
        .insert(ImageTable)
        .values({
          org_id: input.org_id,
          url: upload.data.image.url,
          response: upload.data.response,
          resource_id: input.resource_id,
          resource_kind: input.resource_kind,
          provider: ImageHostLive.provider,
          external_id: upload.data.image.external_id,
          thumbhash: thumbhash.ok ? thumbhash.data : null,
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
    const where = build_image_where_clause(input);

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
