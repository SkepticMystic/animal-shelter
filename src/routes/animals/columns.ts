import Time from "$lib/components/Time.svelte";
import { renderComponent } from "$lib/components/ui/data-table";
import { ANIMALS } from "$lib/const/animal.const";
import type { Animal } from "$lib/server/db/schema/animal.model";
import { TanstackTable } from "$lib/utils/tanstack/table.util";
import { getLocalTimeZone } from "@internationalized/date";
import type { DateRange } from "bits-ui";

type TData = Animal;

export const columns = TanstackTable.make_columns<TData>({
  columns: [
    {
      accessorKey: "name",
      meta: { label: "Name" },
    },
    {
      accessorKey: "species",
      meta: { label: "Species" },

      cell: ({ row }) => ANIMALS.SPECIES.MAP[row.original.species].label,
    },
    {
      accessorKey: "date_of_birth",
      meta: { label: "Birthday" },

      // SOURCE: https://tanstack.com/table/latest/docs/guide/column-filtering#custom-filter-functions
      filterFn: (row, column_id, filter: DateRange | undefined) => {
        if (!filter || !filter.start || !filter.end) return true;

        const date_of_birth = row.getValue<TData["date_of_birth"]>(column_id);
        if (!date_of_birth) return false;

        return (
          date_of_birth >= filter.start.toDate(getLocalTimeZone()) &&
          date_of_birth <= filter.end.toDate(getLocalTimeZone())
        );
      },

      cell: ({ row }) =>
        renderComponent(Time, {
          show: "date",
          date: row.original.date_of_birth,
        }),
    },
    {
      accessorKey: "createdAt",
      meta: { label: "Created" },

      cell: ({ row }) =>
        renderComponent(Time, { date: row.original.createdAt }),
    },
  ],

  actions: [
    {
      kind: "item",
      icon: "lucide/dog",
      title: (row) => `View ${row.original.species}`,
      href: (row) => `/animals/${row.original.short_id}/view`,
    },

    {
      kind: "item",
      icon: "lucide/dog",
      title: (row) => `Edit ${row.original.species}`,
      href: (row) => `/animals/${row.original.short_id}/edit`,
    },
    // {
    //   kind: "item",
    //   title: "Delete task",
    //   icon: "lucide/trash-2",
    //   onselect: (row) =>
    //     Client.request(
    //       () =>
    //         delete_task(row.original.id).updates(
    //           get_tasks({}).withOverride((old) =>
    //             Items.remove(old, row.original.id),
    //           ),
    //         ),
    //       { toast: { optimistic: true, success: "Task deleted" } },
    //     ),
    // },
  ],
});
