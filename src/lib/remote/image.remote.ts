import { command, form } from "$app/server";
import { get_session } from "$lib/auth/server";
import { ImageSchema, type Image } from "$lib/server/db/schema/image.model";
import { ImageService } from "$lib/services/image.service";
import type { APIResult } from "$lib/utils/form.util";
import { err } from "$lib/utils/result.util";
import z from "zod";

export const upload_image_remote = form<APIResult<Image>>(async (form) => {
  const session = await get_session({
    member_permissions: { image: ["create"] },
  });
  if (!session.session.org_id) {
    return err({ message: "Forbidden", status: 403 });
  }

  const file = form.get("file") as File | null;
  if (!file) {
    return err({ message: "No file provided" });
  }

  const reference = ImageSchema.insert
    .pick({ resource_id: true, resource_kind: true })
    .safeParse({
      resource_id: form.get("resource_id"),
      resource_kind: form.get("resource_kind"),
    });

  if (!reference.success) {
    return err({ message: "Invalid resource data" });
  }

  return ImageService.upload(file, {
    ...reference.data,
    org_id: session.session.org_id,
  });
});

export const delete_image_remote = command(
  z.uuid(),
  async (image_id: string): Promise<APIResult<null>> => {
    const session = await get_session({
      member_permissions: { image: ["delete"] },
    });

    if (!session.session.org_id) {
      return err({ message: "Forbidden", status: 403 });
    }

    return ImageService.delete({
      id: image_id,
      org_id: session.session.org_id,
    });
  },
);
