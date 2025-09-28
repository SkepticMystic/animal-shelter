<script lang="ts">
  import { ImageClient } from "$lib/clients/image.client";
  import type { Image } from "$lib/server/db/schema/image.model";
  import { cn } from "$lib/utils/shadcn.util";
  import { Image as Picture, type ImageProps } from "@unpic/svelte";
  import type { ClassValue } from "svelte/elements";
  import Anchor from "../ui/anchor/Anchor.svelte";
  import PictureFallback from "./PictureFallback.svelte";

  let {
    href,
    image,
    fallback,
    class: klass,
    loading,
    fetchpriority,
    prioritize = false,
    ...props
  }: Omit<ImageProps, "src"> & {
    href?: string;
    fallback?: string;
    src?: string | null;
    prioritize?: boolean;
    class?: ClassValue | null;
    image?: Pick<Image, "url" | "thumbhash">;
  } = $props();

  // NOTE: ...rest props are readonly,
  // so we destructure them above and pass them down to Picture
  if (prioritize) {
    loading ??= "eager";
    fetchpriority ??= "high";
  }

  const thumbhash_url = ImageClient.decode_thumbhash(image);

  const style = [
    props.width ? `width: ${props.width}px` : "",
    props.height ? `height: ${props.height}px` : "",
  ]
    .filter(Boolean)
    .join("; ")
    .trim();
</script>

{#snippet inner()}
  {#if image || props.src}
    <Picture
      {style}
      {loading}
      {fetchpriority}
      src={image?.url}
      class={cn("h-full w-full rounded-md", klass)}
      background={thumbhash_url}
      operations={{
        cloudinary: {
          f: "auto",
          q: "auto",

          // "auto" seems fancy, but expensive
          // "fill" seems like a cheaper alternative
          c: "fill",
          g: "auto",
        },
      }}
      {...props}
    />

    <!-- <div
      style="object-fit: cover; 
  background-image: url({thumbhash_url}); 
  background-size: cover; 
  background-repeat: no-repeat; 
  max-width: 300px; 
  max-height: 300px; 
  aspect-ratio: 1 / 1; 
  width: 300px; 
  height: 300px;"
    ></div> -->
  {:else if fallback}
    <PictureFallback {fallback} {style} class={klass} {...props} />
  {/if}
{/snippet}

{#if href}
  <Anchor {href}>
    {@render inner()}
  </Anchor>
{:else}
  {@render inner()}
{/if}
