<script lang="ts">
  import type { Image } from "$lib/server/db/schema/image.model";
  import { cn } from "$lib/utils/shadcn.util";
  import { Image as Picture, type ImageProps } from "@unpic/svelte";
  import type { ClassValue } from "svelte/elements";
  import { thumbHashToDataURL } from "thumbhash";
  import Avatar from "../ui/avatar/avatar.svelte";

  // NOTE: The only reason for this component is that Image from unpic doesn't seem to show types?
  // So we force ImageProps
  let {
    image,
    fallback,
    class: klass,
    ...props
  }: Omit<ImageProps, "src"> & {
    src?: string;
    class?: ClassValue;
    image?: Pick<Image, "url" | "thumbhash">;
    fallback?: string;
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
</script>

{#if image || props.src}
  <Picture
    src={image?.url}
    class={cn(
      "rounded-md", //
      klass,
    )}
    style="width: {props.width}px; height: {props.height}px;"
    background={thumbhash_url}
    {...props}
  />

  <!-- NOTE: This also works, but `background` is cleaner, and works with blurhash as well -->
  <!-- style={thumbhash_url
    ? `background: center / cover url(${thumbhash_url})`
      : undefined} -->
{:else if fallback}
  <!-- TODO: Not the best looking rn, but better than nothing -->
  <Avatar {fallback}></Avatar>
{/if}
