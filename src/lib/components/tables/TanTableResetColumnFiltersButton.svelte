<script lang="ts" generics="TData extends Record<string, unknown>">
  import { ICONS } from "$lib/const/icon.const";
  import type { Table } from "@tanstack/table-core";
  import Button from "../ui/button/button.svelte";

  let {
    table,
  }: {
    table: Table<TData>;
  } = $props();
</script>

{#if table.getState().columnFilters.length}
  <Button
    variant="ghost"
    icon={ICONS.CLOSE}
    onclick={() => table.resetColumnFilters()}
  />
{/if}
