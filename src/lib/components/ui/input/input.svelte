<script lang="ts">
  import { cn } from "$lib/utils/shadcn.util.js";
  import type { ComponentProps, Snippet } from "svelte";
  import Icon from "../icon/Icon.svelte";
  import InputGroupAddon, {
    type InputGroupAddonAlign,
  } from "../input-group/input-group-addon.svelte";
  import InputGroupInput from "../input-group/input-group-input.svelte";
  import InputGroup from "../input-group/input-group.svelte";
  import InputRoot from "./input-root.svelte";

  let {
    icon,
    addon,
    ref = $bindable(null),
    value = $bindable(),
    class: klass,
    align = "inline-end",
    ...restProps
  }: ComponentProps<typeof InputRoot> & {
    icon?: string;
    addon?: Snippet;
    align?: InputGroupAddonAlign;
  } = $props();
</script>

{#if icon || addon}
  <InputGroup>
    <InputGroupInput bind:value class={cn(klass)} {...restProps} />

    <InputGroupAddon {align}>
      {#if icon}
        <Icon {icon} />
      {:else if addon}
        {@render addon()}
      {/if}
    </InputGroupAddon>
  </InputGroup>
{:else}
  <InputRoot bind:ref bind:value class={cn(klass)} {...restProps} />
{/if}
