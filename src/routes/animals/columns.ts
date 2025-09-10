import { resolve } from "$app/paths";
import { AccessClient } from "$lib/clients/access_control.client";
import { AnimalClient } from "$lib/clients/animal.client";
import AnimalLink from "$lib/components/links/AnimalLink.svelte";
import ShelterLink from "$lib/components/links/ShelterLink.svelte";
import Time from "$lib/components/Time.svelte";
import { renderComponent } from "$lib/components/ui/data-table";
import { ANIMALS } from "$lib/const/animal.const";
import { ICONS } from "$lib/const/icon.const";
import { ROUTES } from "$lib/const/routes.const";
import type { get_animals_remote } from "$lib/remote/animal.remote";
import type { Organization } from "$lib/server/db/schema/auth.model";
import { TanstackTable } from "$lib/utils/tanstack/table.util";

type TData = Awaited<ReturnType<typeof get_animals_remote>>[number];

export const columns = TanstackTable.make_columns<TData>({
  columns: [
    {
      accessorKey: "name",
      meta: { label: "Name" },

      cell: ({ row }) => renderComponent(AnimalLink, { animal: row.original }),
    },
    {
      accessorKey: "species",
      meta: { label: "Species" },
      filterFn: "arrIncludesSome",

      cell: ({ row }) => ANIMALS.SPECIES.MAP[row.original.species].label,
    },
    {
      accessorKey: "date_of_birth",
      meta: { label: "Birthday" },

      filterFn: TanstackTable.filter_fns.date_range,

      cell: ({ row }) =>
        renderComponent(Time, { date: row.original.date_of_birth }),
    },
    {
      accessorKey: "createdAt",
      meta: { label: "Created" },

      cell: ({ row }) =>
        renderComponent(Time, { date: row.original.createdAt }),
    },

    {
      // NOTE: It is possible to just use "shelter.slug"
      // But then we don't have the name available for the facet selector
      accessorKey: "shelter",
      meta: { label: "Shelter" },

      filterFn: (row, id, filterValue) => {
        if (!filterValue || filterValue.length === 0) {
          return true;
        }

        const shelter = row.getValue<Organization>(id);
        if (!shelter) return false;

        return filterValue.includes(shelter.slug);
      },

      cell: ({ row }) =>
        renderComponent(ShelterLink, { shelter: row.original.shelter }),
    },
  ],

  actions: [
    {
      kind: "group",
      label: "Animal",
      actions: [
        {
          kind: "item",
          title: "View",
          icon: "lucide/dog",

          href: (row) => resolve(ROUTES.ANIMALS_VIEW, row.original),
        },

        {
          kind: "item",
          title: "Edit",
          icon: ICONS.EDIT,

          hide: () => !AccessClient.member({ animal: ["update"] }),
          href: (row) => resolve(ROUTES.ANIMALS_EDIT, row.original),
        },
        {
          kind: "item",
          title: "Delete",
          icon: ICONS.DELETE,
          variant: "destructive",

          hide: () => !AccessClient.member({ animal: ["delete"] }),
          onselect: (row) => AnimalClient.delete(row.original.id),
        },
      ],
    },
  ],
});
