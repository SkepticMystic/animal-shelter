import { resolve } from "$app/paths";
import { AnimalClient } from "$lib/clients/animal.client";
import ShelterLink from "$lib/components/links/ShelterLink.svelte";
import Time from "$lib/components/Time.svelte";
import { renderComponent } from "$lib/components/ui/data-table";
import { ANIMALS } from "$lib/const/animal.const";
import { ROUTES } from "$lib/const/routes.const";
import type { get_animals_remote } from "$lib/remote/animal.remote";
import { TanstackTable } from "$lib/utils/tanstack/table.util";
import { getLocalTimeZone } from "@internationalized/date";
import type { DateRange } from "bits-ui";

type TData = Awaited<ReturnType<typeof get_animals_remote>>[number];

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

    {
      accessorKey: "organization",
      meta: { label: "Shelter" },

      cell: ({ row }) =>
        renderComponent(ShelterLink, {
          shelter: row.original.shelter,
        }),
    },
  ],

  actions: [
    {
      kind: "item",
      icon: "lucide/dog",
      title: "View animal",
      href: (row) => resolve(ROUTES.ANIMALS_VIEW, row.original),
    },

    {
      kind: "item",
      icon: "lucide/pencil",
      title: "Edit animal",
      // TODO: hide: true if no permission
      href: (row) => resolve(ROUTES.ANIMALS_EDIT, row.original),
    },
    {
      kind: "item",
      title: "Delete animal",
      icon: "lucide/trash-2",
      onselect: (row) => AnimalClient.delete(row.original.id),
    },
  ],
});
