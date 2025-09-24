<script lang="ts">
  import type { Image } from "$lib/server/db/schema/image.model";
  import { cn } from "$lib/utils/shadcn.util";
  import { Image as Picture, type ImageProps } from "@unpic/svelte";
  import type { ClassValue } from "svelte/elements";
  import { thumbHashToDataURL } from "thumbhash";
  import PictureFallback from "./PictureFallback.svelte";

  // NOTE: The only reason for this component is that Image from unpic doesn't seem to show types?
  // So we force ImageProps
  let {
    image,
    fallback,
    class: klass,
    loading,
    fetchpriority,
    prioritize = false,
    ...props
  }: Omit<ImageProps, "src"> & {
    src?: string | null;
    class?: ClassValue | null;
    image?: Pick<Image, "url" | "thumbhash">;
    fallback?: string;
    prioritize?: boolean;
  } = $props();

  // SOURCE: https://github.com/evanw/thumbhash/blob/main/examples/browser/index.html
  const thumbhash_url = image?.thumbhash
    ? thumbHashToDataURL(
        new Uint8Array(
          atob(image.thumbhash)
            .split("")
            .map((x) => x.charCodeAt(0)),
        ),
      )
    : undefined;

  // NOTE: ...rest props are readonly,
  // so we destructure them above and pass them down to Picture
  if (prioritize) {
    loading ??= "eager";
    fetchpriority ??= "high";
  }
</script>

{#if image || props.src}
  <Picture
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
width: 100%; 
height: 100%;"
  ></div> -->
{:else if fallback}
  <PictureFallback {fallback} class={klass} {...props} />
{/if}
