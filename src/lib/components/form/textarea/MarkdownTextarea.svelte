<script lang="ts">
  import { HTMLUtil } from "$lib/utils/html/html.util";
  import { Carta, MarkdownEditor } from "carta-md";

  let {
    value = $bindable(),
  }: {
    value: string | undefined | null;
  } = $props();
  if (!value) value = "";

  const carta = new Carta({
    sanitizer: HTMLUtil.sanitize,
  });
</script>

<!-- The editor doesn't allow null. TS doesn't see that we handle it above -->
{#if value !== null}
  <MarkdownEditor {carta} mode="tabs" selectedTab="write" bind:value />
{/if}
