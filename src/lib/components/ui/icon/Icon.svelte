<script lang="ts">
  import { cn } from "$lib/utils/shadcn.util";
  import type { ClassValue } from "svelte/elements";

  let {
    icon,
    label,
    bg = false,
    class: klass = "",
  }: {
    bg?: boolean;
    label?: string;
    icon?: ClassValue;
    class?: ClassValue;
  } = $props();
</script>

{#snippet inner()}
  <span class={cn(bg ? "icon-bg" : "icon", icon, "size-4", klass)}></span>
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
