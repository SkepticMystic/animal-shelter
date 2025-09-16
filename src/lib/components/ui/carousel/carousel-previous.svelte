<script lang="ts">
  import { Button, type Props } from "$lib/components/ui/button/index.js";
  import { cn } from "$lib/utils/shadcn.util.js";
  import type { WithoutChildren } from "bits-ui";
  import Icon from "../icon/Icon.svelte";
  import { getEmblaContext } from "./context.js";

  let {
    ref = $bindable(null),
    class: className,
    variant = "outline",
    size = "icon",
    ...restProps
  }: WithoutChildren<Props> = $props();

  const emblaCtx = getEmblaContext("<Carousel.Previous/>");
</script>

<Button
  data-slot="carousel-previous"
  {variant}
  {size}
  aria-disabled={!emblaCtx.canScrollPrev}
  class={cn(
    "absolute size-8 rounded-full",
    emblaCtx.orientation === "horizontal"
      ? "top-1/2 -left-12 -translate-y-1/2"
      : "-top-12 left-1/2 -translate-x-1/2 rotate-90",
    className,
  )}
  onclick={emblaCtx.scrollPrev}
  onkeydown={emblaCtx.handleKeyDown}
  {...restProps}
  bind:ref
>
  <Icon icon="lucide/arrow-left" size="size-4" />
  <span class="sr-only">Previous slide</span>
</Button>
