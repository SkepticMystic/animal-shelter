<script lang="ts">
  import type { Image } from "$lib/server/db/schema/image.model";
  import type { Snippet } from "svelte";
  import DeleteImageButton from "../buttons/DeleteImageButton.svelte";

  let {
    image,
    children,
    on_delete,
  }: {
    children: Snippet;
    image: Pick<Image, "id" | "url" | "thumbhash">;
    on_delete?: () => void;
  } = $props();
</script>

<!-- TODO: These hover actions don't work on mobile -->
<div class="group relative">
  {@render children()}

  <!-- NOTE: Don't put absolute on the button directly,
   it messes with the icon placement inside -->
  <div class="absolute top-1 right-1 hidden group-hover:block">
    <DeleteImageButton {on_delete} image_id={image.id} />
  </div>
</div>
