<script lang="ts">
  import Button from "$lib/components/ui/button/button.svelte";
  import Input from "$lib/components/ui/input/input.svelte";
  import type { MaybePromise } from "$lib/interfaces";
  import { upload_image_remote } from "$lib/remote/image.remote";
  import type { Image } from "$lib/server/db/schema/image.model";
  import { Blurhash } from "$lib/utils/blurhash.util";
  import type { APIResult } from "$lib/utils/form.util";
  import { toast } from "svelte-sonner";

  let {
    on_upload,
    resource_id,
    resource_kind,
  }: Pick<Image, "resource_id" | "resource_kind"> & {
    on_upload?: (image: Image) => MaybePromise<unknown>;
  } = $props();

  let loading = $state(false);

  let blurhash_promise: ReturnType<typeof Blurhash.generate> | null = null;
</script>

<form
  enctype="multipart/form-data"
  {...upload_image_remote.enhance(async ({ data, submit }) => {
    const file = data.get("file") as File;
    if (!file) return;

    loading = true;

    const blurhash = await (blurhash_promise ?? Blurhash.generate(file));
    if (blurhash.ok) {
      data.set("blurhash", blurhash.data);
    }

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

    loading = false;
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
      class="w-52"
      oninput={(e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) return;

        blurhash_promise = Blurhash.generate(file);
      }}
    />

    <Button {loading} type="submit" icon="lucide/image">Upload</Button>
  </div>
</form>
