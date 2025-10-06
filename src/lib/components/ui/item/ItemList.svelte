<script lang="ts" generics="T extends Resource">
  import type { Resource } from "$lib/utils/items.util";
  import { cn } from "$lib/utils/shadcn.util";
  import type { ComponentProps, Snippet } from "svelte";
  import type { ClassValue } from "svelte/elements";
  import Empty from "../empty/Empty.svelte";
  import ItemGroup from "./item-group.svelte";
  import ItemSeparator from "./item-separator.svelte";

  let {
    item,
    items,
    empty,
    class: klass,
  }: {
    items: T[];
    item: Snippet<[T, number]>;
    empty?: ComponentProps<typeof Empty>;
    class?: ClassValue;
  } = $props();
</script>

<ItemGroup class={cn("rounded-md border bg-background shadow", klass)}>
  {#if items.length}
    {#each items as row, i (row.id)}
      {@render item(row, i)}

      {#if i < items.length - 1}
        <ItemSeparator />
      {/if}
    {/each}
  {:else if empty}
    <Empty {...empty}></Empty>
  {/if}
</ItemGroup>
