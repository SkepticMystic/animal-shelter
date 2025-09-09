<script lang="ts">
  import Button from "$lib/components/ui/button/button.svelte";
  import Input from "$lib/components/ui/input/input.svelte";
  import { upload_image_remote } from "$lib/remote/image.remote";
  import type { Image } from "$lib/server/db/schema/image.model";
  import { toast } from "svelte-sonner";

  // NOTE: A nice thing about using a remote _form_, is that it invalidatesAll after submit,
  // So we don't need an on_upload cb. Any pages showing images will auto-update.
  let {
    resource_id,
    resource_kind,
  }: Pick<Image, "resource_id" | "resource_kind"> = $props();
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
    <Input required type="file" name="file" accept="image/*" class="w-fit" />

    <Button
      type="submit"
      icon="lucide/image"
      loading={Boolean(upload_image_remote.pending)}
    >
      Upload
    </Button>
  </div>
</form>
