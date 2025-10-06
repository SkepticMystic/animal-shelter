<script lang="ts">
  import { cn } from "$lib/utils/shadcn.util.js";
  import type { ComponentProps } from "svelte";
  import { Separator } from "$lib/components/ui/separator/index.js";

  let {
    class: className,
    orientation = "vertical",
    ...restProps
  }: ComponentProps<typeof Separator> = $props();
</script>

<Separator
  {orientation}
  data-slot="button-group-separator"
  class={cn(
    "relative !m-0 self-stretch bg-input data-[orientation=vertical]:h-auto",
    className,
  )}
  {...restProps}
/>
