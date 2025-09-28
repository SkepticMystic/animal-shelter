<script lang="ts" generics="T extends Record<string, unknown>">
  import type { Snippet } from "svelte";
  import Carousel from "./Carousel.svelte";
  import CarouselContent from "./carousel-content.svelte";
  import CarouselItem from "./carousel-item.svelte";

  let {
    item,
    items,
  }: {
    items: T[];
    item: Snippet<[T, number]>;
  } = $props();
</script>

<Carousel>
  {#snippet content()}
    <CarouselContent class="-ml-3 md:-ml-4">
      {#each items as _, i (i)}
        <CarouselItem class="basis-auto pl-3 md:pl-4">
          {@render item(items[i], i)}
        </CarouselItem>
      {/each}
    </CarouselContent>
  {/snippet}
</Carousel>
