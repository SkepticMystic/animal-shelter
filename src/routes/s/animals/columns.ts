import { resolve } from "$app/paths";
import { AccessClient } from "$lib/clients/access_control.client";
import { AnimalClient } from "$lib/clients/animal.client";
import Picture from "$lib/components/images/Picture.svelte";
import AnimalLink from "$lib/components/links/AnimalLink.svelte";
import Time from "$lib/components/Time.svelte";
import { renderComponent } from "$lib/components/ui/data-table";
import Icon from "$lib/components/ui/icon/Icon.svelte";
import { ANIMALS } from "$lib/const/animal.const";
import { ICONS } from "$lib/const/icon.const";
import { IMAGES } from "$lib/const/image.const";
import { ROUTES } from "$lib/const/routes.const";
import type { get_shelter_animals_remote } from "$lib/remote/animal.remote";
import { Format } from "$lib/utils/format.util";
import { TanstackTable } from "$lib/utils/tanstack/table.util";

type TData = Awaited<ReturnType<typeof get_shelter_animals_remote>>[number];

export const columns = TanstackTable.make_columns<TData>({
  columns: [
    {
      id: "avatar",
      enableHiding: false,
      enableSorting: false,

      cell: ({ row }) =>
        renderComponent(Picture, {
          ...IMAGES.SIZES.AVATAR,
          image: row.original.images.at(0),
          fallback: row.original.name[0],
        }),
    },

    {
      accessorKey: "name",
      meta: { label: "Name" },

      cell: ({ row }) => renderComponent(AnimalLink, { animal: row.original }),
    },
    {
      accessorKey: "species",
      meta: { label: "Species" },
      filterFn: "arrIncludesSome",

      cell: ({ row }) =>
        renderComponent(Icon, {
          icon: ANIMALS.SPECIES.MAP[row.original.species].icon,
          label: ANIMALS.SPECIES.MAP[row.original.species].label,
        }),
    },

    {
      accessorKey: "gender",
      meta: { label: "Gender" },
      filterFn: "arrIncludesSome",

      cell: ({ row }) =>
        renderComponent(Icon, {
          icon: ANIMALS.GENDER.MAP[row.original.gender].icon,
          label: ANIMALS.GENDER.MAP[row.original.gender].label,
        }),
    },

    {
      accessorKey: "date_of_birth",
      meta: { label: "Age" },

      filterFn: TanstackTable.filter_fns.date_range,

      cell: ({ row }) =>
        renderComponent(Time, {
          date: row.original.date_of_birth,
          show: (dt) =>
            Format.date_distance(dt, {
              suffix: false,
              numeric: "always",
              style: "short",
            }),
        }),
    },
    {
      accessorKey: "intake_date",
      meta: { label: "Intake" },

      cell: ({ row }) =>
        renderComponent(Time, {
          date: row.original.intake_date,
          show: (dt) => Format.date_distance(dt),
        }),
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

          hide: () => !AccessClient.member_can({ animal: ["update"] }),
          href: (row) => resolve(ROUTES.SHELTER_ANIMALS_EDIT, row.original),
        },
        {
          kind: "item",
          title: "Delete",
          icon: ICONS.DELETE,
          variant: "destructive",

          hide: () => !AccessClient.member_can({ animal: ["delete"] }),
          onselect: (row) => AnimalClient.delete(row.original.id),
        },
      ],
    },
  ],
});
