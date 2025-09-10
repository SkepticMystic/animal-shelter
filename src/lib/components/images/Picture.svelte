<script lang="ts">
  import { IMAGES } from "$lib/const/image.const";
  import type { Image } from "$lib/server/db/schema/image.model";
  import { blurhashToCssGradientString } from "@unpic/placeholder";
  import { Image as Picture, type ImageProps } from "@unpic/svelte";

  // NOTE: The only reason for this component is that Image from unpic doesn't seem to show types?
  // So we force ImageProps
  let {
    image,
    ...props
  }: Omit<ImageProps, "src"> & {
    src?: string;
    image?: Pick<Image, "url" | "blurhash">;
  } = $props();
</script>

<Picture
  src={image?.url}
  {...props}
  background={image?.blurhash
    ? blurhashToCssGradientString(
        image.blurhash,
        IMAGES.BLURHASH.COMPONENTS.X,
        IMAGES.BLURHASH.COMPONENTS.Y,
      )
    : undefined}
/>
