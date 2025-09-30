<script lang="ts" generics="TData extends Item, TValue">
  import { createSvelteTable } from "$lib/components/ui/data-table/index.js";
  import type { Item } from "$lib/utils/items.util";
  import type { SvelteTableInput } from "$lib/utils/tanstack/table.util.svelte";
  import type { Table } from "@tanstack/table-core";
  import {
    getCoreRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
  } from "@tanstack/table-core";
  import type { Snippet } from "svelte";

  /** Rune-y wrapper around createSvelteTable
   * Let's us render different UI around the tanstack functionality
   * Not just a Shad datatable, but could be a grid of cards, for example
   */

  let {
    data,
    columns,
    faceting,
    states = {},
    children,
  }: SvelteTableInput<TData, TValue> & {
    children: Snippet<[Table<TData>]>;
  } = $props();

  let sorting = $state(
    states.sorting === false ? undefined : (states.sorting ?? []),
  );
  let selection = $state(
    states.selection === false ? undefined : (states.selection ?? {}),
  );
  let visibility = $state(
    states.visibility === false ? undefined : (states.visibility ?? {}),
  );

  let pagination = $state(
    states.pagination === false
      ? undefined
      : (states.pagination ?? { pageIndex: 0, pageSize: 10 }),
  );

  let column_filters = $state(
    states.column_filters === false ? undefined : (states.column_filters ?? []),
  );

  const table = createSvelteTable({
    columns,

    get data() {
      return data;
    },

    getCoreRowModel: getCoreRowModel(),

    getSortedRowModel:
      states.sorting === false ? undefined : getSortedRowModel(),

    getPaginationRowModel:
      states.pagination === false ? undefined : getPaginationRowModel(),

    getFilteredRowModel:
      states.column_filters === false ? undefined : getFilteredRowModel(),

    getFacetedRowModel: faceting === true ? getFacetedRowModel() : undefined,
    getFacetedUniqueValues:
      faceting === true ? getFacetedUniqueValues() : undefined,

    state: {
      get sorting() {
        return sorting;
      },
      get pagination() {
        return pagination;
      },
      get rowSelection() {
        return selection;
      },
      get columnFilters() {
        return column_filters;
      },
      get columnVisibility() {
        return visibility;
      },
    },

    onSortingChange:
      states.sorting === false
        ? undefined
        : (updater) =>
            (sorting =
              typeof updater === "function" ? updater(sorting!) : updater),

    onColumnFiltersChange:
      states.column_filters === false
        ? undefined
        : (updater) =>
            (column_filters =
              typeof updater === "function"
                ? updater(column_filters!)
                : updater),

    onPaginationChange:
      states.pagination === false
        ? undefined
        : (updater) =>
            (pagination =
              typeof updater === "function" ? updater(pagination!) : updater),

    onRowSelectionChange:
      states.selection === false
        ? undefined
        : (updater) =>
            (selection =
              typeof updater === "function" ? updater(selection!) : updater),

    onColumnVisibilityChange:
      states.visibility === false
        ? undefined
        : (updater) =>
            (visibility =
              typeof updater === "function" ? updater(visibility!) : updater),
  });
</script>

{@render children(table)}
