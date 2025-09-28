<script lang="ts">
  import { cn } from "$lib/utils/shadcn.util";
  import { type ImageProps } from "@unpic/svelte";
  import type { Snippet } from "svelte";
  import type { ClassValue } from "svelte/elements";

  // NOTE: The only reason for this component is that Image from unpic doesn't seem to show types?
  // So we force ImageProps
  let {
    fallback,
    class: klass,
    ...props
  }: Omit<ImageProps, "src"> & {
    class?: ClassValue | null;
    fallback?: string | Snippet;
  } = $props();
</script>

<!-- NOTE: Tried to use Avatar and AvatarFallback, but could never get it right -->
<div
  {...props}
  class={cn("flex items-center justify-center rounded-md bg-muted", klass)}
>
  {#if fallback}
    {#if typeof fallback === "string"}
      {fallback}
    {:else}
      {@render fallback()}
    {/if}
  {/if}
</div>
