import { command, form } from "$app/server";
import { get_session } from "$lib/auth/server";
import { db } from "$lib/server/db/drizzle.db";
import {
  ImageSchema,
  ImageTable,
  type Image,
} from "$lib/server/db/schema/image.model";
import { ImageLive } from "$lib/services/image.service";
import type { APIResult } from "$lib/utils/form.util";
import { err, suc } from "$lib/utils/result.util";
import { eq } from "drizzle-orm";
import { Effect } from "effect";
import z from "zod";

export const upload_image_remote = form<APIResult<Image>>(async (form) => {
  const session = await get_session({
    member_permissions: { image: ["create"] },
  });
  if (!session.session.activeOrganizationId) {
    return err({ message: "Forbidden", status: 403 });
  }

  const file = form.get("file") as File | null;
  if (!file) {
    return err({ message: "No file provided" });
  }

  const input = {
    resource_id: form.get("resource_id"),
    resource_kind: form.get("resource_kind"),
  };

  const resource = ImageSchema.insert
    .pick({ resource_id: true, resource_kind: true })
    .safeParse(input);

  if (!resource.success) {
    return err({ message: "Invalid resource data" });
  }

  const res = await Effect.runPromise(ImageLive.upload({ file }));
  console.log("Image upload result:", res);
  if (!res.ok) {
    return res;
  }

  try {
    const [image] = await db
      .insert(ImageTable)
      .values({
        url: res.data.url,
        provider: ImageLive.provider,
        external_id: res.data.external_id,
        resource_id: resource.data.resource_id,
        resource_kind: resource.data.resource_kind,
        org_id: session.session.activeOrganizationId,
      })
      .returning();

    return suc(image);
  } catch (error) {
    console.error("Database insertion error:", error);
    // Attempt to clean up the uploaded image if DB insertion fails

    return err({ message: "Failed to save image record" });
  }
});

export const delete_image_remote = command(
  z.uuid(),
  async (image_id: string): Promise<APIResult<null>> => {
    const session = await get_session({
      member_permissions: { image: ["delete"] },
    });
    if (!session.session.activeOrganizationId) {
      return err({ message: "Forbidden", status: 403 });
    }

    const image = await db.query.image.findFirst({
      columns: { external_id: true },

      where: (img, { eq, and }) =>
        and(
          eq(img.id, image_id),
          eq(img.org_id, session.session.activeOrganizationId!),
        ),
    });

    if (!image) {
      return err({ message: "Image not found", status: 404 });
    }

    const res = await Effect.runPromise(ImageLive.delete(image.external_id));
    console.log("Image delete result:", res);
    if (!res.ok) {
      return err({ message: "Image deletion failed" });
    }

    await db.delete(ImageTable).where(eq(ImageTable.id, image_id));

    return suc(null);
  },
);
