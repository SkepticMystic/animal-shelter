<script lang="ts">
  import * as Carousel from "$lib/components/ui/carousel/index.js";
  import type { WithElementRef } from "$lib/utils/shadcn.util";
  import type { Snippet } from "svelte";
  import type { CarouselProps } from "./context";

  let {
    content,
    ...rest_props
  }: WithElementRef<CarouselProps> & {
    /** Expects the Carousel.Content wrapper */
    content: Snippet;
  } = $props();
</script>

<Carousel.Root {...rest_props}>
  {@render content()}

  <div class="hidden lg:block">
    <Carousel.Previous />
    <Carousel.Next />
  </div>
</Carousel.Root>
