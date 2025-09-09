<script lang="ts">
  import type { Image } from "$lib/server/db/schema/image.model";
  import { cn } from "$lib/utils/shadcn.util";
  import { CldImage } from "svelte-cloudinary";
  import type { ClassValue } from "svelte/elements";

  let {
    image,
    ...props
  }: {
    image: Pick<Image, "provider" | "url">;
  } & {
    alt?: string;
    width: number;
    height: number;
    class?: ClassValue;
  } = $props();
</script>

{#if image.provider === "cloudinary"}
  <CldImage src={image.url} class={cn("rounded-md", props.class)} {...props} />
{/if}
