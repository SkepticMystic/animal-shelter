<script lang="ts">
  import type { ClassValue } from "svelte/elements";

  let {
    icon,
    size,
    label,
    bg = false,
    class: klass = "",
  }: {
    bg?: boolean;
    icon?: ClassValue;
    class?: ClassValue;
    size?: `size-${number}`;
    label?: string;
  } = $props();
</script>

{#snippet inner()}
  <span class="{bg ? 'icon-bg' : 'icon'} {icon} {size} {klass}"></span>
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
