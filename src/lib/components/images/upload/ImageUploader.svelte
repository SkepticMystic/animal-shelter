<script lang="ts">
  import Button from "$lib/components/ui/button/button.svelte";
  import Input from "$lib/components/ui/input/input.svelte";
  import type { MaybePromise } from "$lib/interfaces";
  import { upload_image_remote } from "$lib/remote/image.remote";
  import type { Image } from "$lib/server/db/schema/image.model";
  import { toast } from "svelte-sonner";

  let {
    on_upload,
    resource_id,
    resource_kind,
  }: Pick<Image, "resource_id" | "resource_kind"> & {
    on_upload?: (image: Image) => MaybePromise<unknown>;
  } = $props();
</script>

<form
  enctype="multipart/form-data"
  {...upload_image_remote.enhance(async ({ submit }) => {
    await submit();

    console.log("upload_image_remote.result", upload_image_remote.result);
    if (!upload_image_remote.result || !upload_image_remote.result.ok) {
      toast.error(
        `Error uploading image: ${upload_image_remote.result?.error?.message}`,
      );
    } else if (upload_image_remote.result.ok) {
      await on_upload?.(upload_image_remote.result.data);
      toast.success("Image uploaded successfully");
    }
  })}
>
  <input type="text" class="hidden" name="resource_id" value={resource_id} />

  <input
    type="text"
    class="hidden"
    name="resource_kind"
    value={resource_kind}
  />

  <div class="flex gap-1">
    <Input
      required
      type="file"
      name="file"
      accept="image/*"
      capture="environment"
      class="w-52"
    />

    <Button
      type="submit"
      icon="lucide/image"
      loading={Boolean(upload_image_remote.pending)}
    >
      Upload
    </Button>
  </div>
</form>
