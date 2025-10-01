<script lang="ts">
  import { HTMLUtil } from "$lib/utils/html/html.util";
  import { emoji } from "@cartamd/plugin-emoji";
  import { Carta, MarkdownEditor } from "carta-md";
  import type { ComponentProps } from "svelte";

  let {
    value = $bindable(),
    ...rest
  }: Omit<ComponentProps<typeof MarkdownEditor>, "carta" | "value"> & {
    value: string | undefined | null;
  } = $props();
  // The editor doesn't allow null
  if (value === null) {
    value = undefined;
  }

  const carta = new Carta({
    extensions: [emoji()],
    sanitizer: HTMLUtil.sanitize,
  });
</script>

{#if value !== null}
  <MarkdownEditor
    {carta}
    mode="tabs"
    selectedTab="write"
    {...rest}
    bind:value
  />
{/if}
