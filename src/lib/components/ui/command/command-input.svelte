<script lang="ts">
  import { cn } from "$lib/utils/shadcn.util.js";
  import { Command as CommandPrimitive } from "bits-ui";
  import Icon from "../icon/Icon.svelte";

  let {
    ref = $bindable(null),
    class: className,
    value = $bindable(""),
    ...restProps
  }: CommandPrimitive.InputProps = $props();
</script>

<div
  class="flex h-9 items-center gap-2 border-b pr-8 pl-3"
  data-slot="command-input-wrapper"
>
  <Icon icon="lucide/search" class="size-4 shrink-0 opacity-50" />

  <CommandPrimitive.Input
    data-slot="command-input"
    class={cn(
      "flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-hidden placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
      className,
    )}
    bind:ref
    {...restProps}
    bind:value
  />
</div>
