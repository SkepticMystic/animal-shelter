import { resolve } from "$app/paths";
import ShelterLink from "$lib/components/links/ShelterLink.svelte";
import Time from "$lib/components/Time.svelte";
import { renderComponent } from "$lib/components/ui/data-table";
import { ROUTES } from "$lib/const/routes.const";
import type { get_shelters_remote } from "$lib/remote/shelter.remote";
import { Format } from "$lib/utils/format.util";
import { TanstackTable } from "$lib/utils/tanstack/table.util";

type TData = Awaited<ReturnType<typeof get_shelters_remote>>[number];

export const columns = TanstackTable.make_columns<TData>({
  columns: [
    {
      accessorKey: "name",
      meta: { label: "Name" },

      cell: ({ row }) =>
        renderComponent(ShelterLink, { shelter: row.original }),
    },

    {
      accessorKey: "animal_count",
      meta: { label: "Animals" },

      cell: ({ row }) => Format.number(row.original.animal_count),
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
      icon: "lucide/eye",
      title: "View shelter",
      href: (row) => resolve(ROUTES.SHELTERS_VIEW, row.original),
    },
  ],
});
