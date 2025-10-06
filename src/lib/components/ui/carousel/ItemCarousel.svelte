<script lang="ts" generics="T extends Record<string, unknown>">
  import type { Snippet } from "svelte";
  import Empty, { type EmptyProps } from "../empty/Empty.svelte";
  import Carousel from "./Carousel.svelte";
  import CarouselContent from "./carousel-content.svelte";
  import CarouselItem from "./carousel-item.svelte";

  let {
    item,
    items,
    empty,
    class: klass,
  }: {
    items: T[];
    item: Snippet<[T, number]>;
    class?: string;
    empty?: EmptyProps;
  } = $props();
</script>

{#if items.length}
  <Carousel class={klass}>
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
{:else}
  <Empty {...empty} />
{/if}
