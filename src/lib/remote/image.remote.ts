import { command, form } from "$app/server";
import { get_session } from "$lib/auth/server";
import { ImageSchema } from "$lib/server/db/schema/image.model";
import { ImageService } from "$lib/services/image.service";
import type { APIResult } from "$lib/utils/form.util";
import { err } from "$lib/utils/result.util";
import z from "zod";

export const upload_image_remote = form(
  ImageSchema.insert
    .pick({
      resource_id: true,
      resource_kind: true,
    })
    .extend({
      file: z.instanceof(File),
    }),
  async (input) => {
    const session = await get_session({
      member_permissions: { image: ["create"] },
    });
    if (!session.session.org_id) {
      return err({ message: "Forbidden", status: 403 });
    }

    return ImageService.upload(input.file, {
      ...input,
      org_id: session.session.org_id,
    });
  },
);

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
