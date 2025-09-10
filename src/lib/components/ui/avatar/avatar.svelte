<script lang="ts">
  import * as Avatar from "$lib/components/ui/avatar/index.js";
  import type { AvatarRootProps } from "bits-ui";
  import type { Snippet } from "svelte";

  let {
    src,
    img,
    fallback,
    alt = "Avatar",
    ...rest
  }: AvatarRootProps & {
    alt?: string;
    fallback?: string;
    src?: string | null;

    img?: Snippet<[{ class: string; "data-slot": string }]>;
  } = $props();
</script>

<Avatar.Root {...rest}>
  {#if img}
    <!-- Copied from Avatar.image props -->
    {@render img({
      "data-slot": "avatar-image",
      class: "aspect-square size-full",
    })}
  {:else}
    <Avatar.Image {src} {alt} />
  {/if}

  <Avatar.Fallback>{fallback}</Avatar.Fallback>
</Avatar.Root>
