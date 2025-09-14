<script lang="ts">
  import type { Image } from "$lib/server/db/schema/image.model";
  import { cn } from "$lib/utils/shadcn.util";
  import { Image as Picture, type ImageProps } from "@unpic/svelte";
  import type { ClassValue } from "svelte/elements";
  import { thumbHashToDataURL } from "thumbhash";

  // NOTE: The only reason for this component is that Image from unpic doesn't seem to show types?
  // So we force ImageProps
  let {
    image,
    fallback,
    class: klass,
    ...props
  }: Omit<ImageProps, "src"> & {
    src?: string | null;
    class?: ClassValue | null;
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

  const style = `width: ${props.width}px; height: ${props.height}px;`;
</script>

{#if image || props.src}
  <Picture
    {style}
    src={image?.url}
    background={thumbhash_url}
    class={cn("rounded-md", klass)}
    {...props}
  />
{:else if fallback}
  <!-- NOTE: Tried to use Avatar and AvatarFallback, but could never get it right -->
  <div
    {...props}
    {style}
    class={cn("flex items-center justify-center rounded-md bg-muted", klass)}
  >
    {fallback}
  </div>
{/if}
