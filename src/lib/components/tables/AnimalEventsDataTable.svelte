<script lang="ts">
  import { AccessClient } from "$lib/clients/access_control.client";
  import { AnimalEventClient } from "$lib/clients/animal_event.client";
  import DataTable from "$lib/components/ui/data-table/data-table.svelte";
  import { ANIMAL_EVENTS } from "$lib/const/animal_event.const";
  import { ICONS } from "$lib/const/icon.const";
  import type { AnimalEvent } from "$lib/server/db/schema/animal_event.model";
  import { AnimalEventUtil } from "$lib/utils/animal_event.util";
  import { Items } from "$lib/utils/items.util";
  import { Strings } from "$lib/utils/strings.util";
  import { TanstackTable } from "$lib/utils/tanstack/table.util";
  import type { DateRange } from "bits-ui";
  import { type ComponentProps } from "svelte";
  import AnimalLink from "../links/AnimalLink.svelte";
  import Time from "../Time.svelte";
  import Button from "../ui/button/button.svelte";
  import { renderComponent } from "../ui/data-table";
  import DateRangePicker from "../ui/date-picker/DateRangePicker.svelte";
  import Icon from "../ui/icon/Icon.svelte";
  import MultiSelect from "../ui/select/MultiSelect.svelte";

  type TData = Pick<
    AnimalEvent,
    "id" | "administered_by_member_id" | "data" | "notes" | "timestamp"
  > & {
    animal: ComponentProps<typeof AnimalLink>["animal"];
  };

  let {
    rows,
    visibility = false,
  }: {
    rows: TData[];
    visibility?: Partial<Record<keyof TData, boolean>> | false;
  } = $props();

  const columns = TanstackTable.make_columns<TData>({
    columns: [
      {
        accessorKey: "timestamp",
        meta: { label: "Date" },

        filterFn: TanstackTable.filter_fns.date_range,

        cell: ({ row }) =>
          renderComponent(Time, { date: row.original.timestamp }),
      },

      {
        // NOTE: id is different from nested accessorKey
        // so that the type is simpler on `visibility` prop
        id: "animal",
        accessorKey: "animal.name",
        meta: { label: "Animal" },

        cell: ({ row }) =>
          renderComponent(AnimalLink, { animal: row.original.animal }),
      },

      {
        // CURSED: If the accessorKey has a . in it, Tanstack replaces it with _ in the column.id
        // So we set it explicitly here to avoid confusion
        id: "data.kind",
        accessorKey: "data.kind",
        meta: { label: "Type" },

        filterFn: "arrIncludesSome",

        cell: ({ row }) =>
          renderComponent(Icon, {
            icon: ANIMAL_EVENTS.KINDS.MAP[row.original.data.kind].icon,
            label: ANIMAL_EVENTS.KINDS.MAP[row.original.data.kind].label,
          }),
      },

      {
        id: "summary",
        meta: { label: "Info" },

        cell: ({ row }) => AnimalEventUtil.summarise_data(row.original),
      },

      {
        accessorKey: "notes",
        meta: { label: "Notes" },

        cell: ({ row }) =>
          row.original.notes ? Strings.ellipsify(row.original.notes, 50) : "-",
      },
    ],

    actions: [
      {
        kind: "item",
        icon: ICONS.DELETE,
        title: "Delete event",
        variant: "destructive",

        disabled: (_row) =>
          !AccessClient.member_can({ animal_event: ["delete"] }),

        onselect: (row) =>
          AnimalEventClient.delete(row.original.id).then(
            (res) => res.ok && (rows = Items.remove(rows, row.original.id)),
          ),
      },
    ],
  });
</script>

<DataTable
  {columns}
  faceting
  data={rows}
  states={{
    visibility,
    sorting: [{ id: "timestamp", desc: true }],
  }}
>
  {#snippet filters(table)}
    <div class="flex gap-1.5">
      <MultiSelect
        options={ANIMAL_EVENTS.KINDS.OPTIONS}
        placeholder="Types"
        bind:value={
          () =>
            (table.getColumn("data.kind")?.getFilterValue() ?? []) as string[],
          (value) => table.getColumn("data.kind")?.setFilterValue(value)
        }
      />

      <DateRangePicker
        placeholder="Date"
        bind:value={
          () =>
            table.getColumn("timestamp")?.getFilterValue() as
              | DateRange
              | undefined,
          (value) => table.getColumn("timestamp")?.setFilterValue(value)
        }
      />

      {#if table.getState().columnFilters.length}
        <Button
          icon="lucide/x"
          variant="ghost"
          onclick={() => table.resetColumnFilters()}
        >
          Clear
        </Button>
      {/if}
    </div>
  {/snippet}
</DataTable>
