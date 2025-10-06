<script lang="ts">
  import ButtonGroup from "$lib/components/ui/button-group/button-group.svelte";
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
    images = $bindable([]),
  }: Pick<Image, "resource_id" | "resource_kind"> & {
    images?: Partial<Image>[];
    /** Don't use this to push the new image onto an array, rather bind to `images` */
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
        upload_image_remote.result?.error?.message || "Upload failed",
      );
    } else if (upload_image_remote.result.ok) {
      toast.success("Image uploaded successfully");

      images = [...images, upload_image_remote.result.data];
      await on_upload?.(upload_image_remote.result.data);
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

  <ButtonGroup>
    <Input
      required
      type="file"
      name="file"
      class="max-w-[220px]"
      accept="image/*"
    />

    <!-- NOTE: On my phone, atleast, this forces the camera, no option for file upload -->
    <!-- capture="environment" -->

    <Button
      type="submit"
      variant="default"
      icon="lucide/upload"
      loading={Boolean(upload_image_remote.pending)}
    ></Button>
  </ButtonGroup>
</form>
