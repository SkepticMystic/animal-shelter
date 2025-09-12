<script lang="ts">
  import { ImageClient } from "$lib/clients/image.client";
  import { ICONS } from "$lib/const/icon.const";
  import type { MaybePromise } from "$lib/interfaces";
  import type { ClassValue } from "svelte/elements";
  import Button from "../ui/button/button.svelte";

  let {
    image_id,
    on_delete,
    class: klass,
  }: {
    image_id: string;
    class?: ClassValue;
    on_delete?: (image_id: string) => MaybePromise<unknown>;
  } = $props();
</script>

<Button
  class={klass}
  icon={ICONS.DELETE}
  title="Delete image"
  variant="destructive"
  onclick={() =>
    ImageClient.delete(image_id).then((r) => r.ok && on_delete?.(image_id))}
></Button>
