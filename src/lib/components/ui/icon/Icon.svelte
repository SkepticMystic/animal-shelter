<script lang="ts">
  import { cn } from "$lib/utils/shadcn.util";
  import type { ClassValue, HTMLAttributes } from "svelte/elements";

  let {
    icon,
    label,
    title,
    bg = false,
    class: klass = "",
    ...rest
  }: HTMLAttributes<HTMLSpanElement> & {
    bg?: boolean;
    label?: string;
    icon?: ClassValue;
    class?: ClassValue;
  } = $props();
</script>

{#snippet inner()}
  <span
    {title}
    class={cn(bg ? "icon-bg" : "icon", icon, "size-4", klass)}
    {...rest}
  ></span>
{/snippet}

<!-- These values are configurable in the iconify/tailwind plugin, found in app.css -->
{#if icon}
  {#if label}
    <span class="flex items-center gap-1.5">
      {@render inner()}
      {label}
    </span>
  {:else}
    {@render inner()}
  {/if}
{/if}
