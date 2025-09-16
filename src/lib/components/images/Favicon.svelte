<script lang="ts">
  import { IMAGES } from "$lib/const/image.const";
  import { cn } from "$lib/utils/shadcn.util";
  import { Url } from "$lib/utils/urls";
  import type { Snippet } from "svelte";
  import PictureFallback from "./PictureFallback.svelte";

  let {
    href,
    fallback,
    alt = "",
    class: klass = "",
    size = IMAGES.SIZES.AVATAR.height,
  }: {
    alt?: string;
    href: string;
    size?: number;
    class?: string;
    fallback?: string | Snippet;
  } = $props();

  const url = Url.safe(href);
</script>

{#if url}
  <img
    {alt}
    class={cn("rounded-md", klass)}
    style="width: {size}px; height={size}px;"
    src="https://www.google.com/s2/favicons?domain={url.hostname}&sz={size * 2}"
  />
{:else}
  <PictureFallback class={klass} width={size} height={size} {fallback} />
{/if}
