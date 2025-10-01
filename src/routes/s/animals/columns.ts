import { resolve } from "$app/paths";
import { AccessClient } from "$lib/clients/access_control.client";
import { AnimalClient } from "$lib/clients/animal.client";
import Picture from "$lib/components/images/Picture.svelte";
import AnimalLink from "$lib/components/links/AnimalLink.svelte";
import Time from "$lib/components/Time.svelte";
import { Badge } from "$lib/components/ui/badge";
import { renderComponent } from "$lib/components/ui/data-table";
import Icon from "$lib/components/ui/icon/Icon.svelte";
import { ANIMALS } from "$lib/const/animal.const";
import { ICONS } from "$lib/const/icon.const";
import { IMAGES } from "$lib/const/image.const";
import { ROUTES } from "$lib/const/routes.const";
import type { get_shelter_animals_remote } from "$lib/remote/animal.remote";
import { Format } from "$lib/utils/format.util";
import { TanstackTable } from "$lib/utils/tanstack/table.util.svelte";

type TData = Awaited<ReturnType<typeof get_shelter_animals_remote>>[number];

export const columns = TanstackTable.make_columns<TData>(
  ({ display, accessor }) => ({
    columns: [
      display({
        id: "avatar",
        enableHiding: false,
        enableSorting: false,

        cell: ({ row }) =>
          renderComponent(Picture, {
            ...IMAGES.SIZES.AVATAR,
            image: row.original.images.at(0),
            fallback: row.original.name[0],
          }),
      }),

      accessor("name", {
        meta: { label: "Name" },

        cell: ({ row }) =>
          renderComponent(AnimalLink, { animal: row.original }),
      }),

      accessor("status", {
        meta: { label: "Status" },
        filterFn: "arrIncludesSome",

        cell: ({ getValue }) =>
          renderComponent(Badge, ANIMALS.STATUS.MAP[getValue()]),
      }),

      accessor("species", {
        meta: { label: "Species" },
        filterFn: "arrIncludesSome",

        cell: ({ getValue }) =>
          renderComponent(Icon, ANIMALS.SPECIES.MAP[getValue()]),
      }),

      accessor("gender", {
        meta: { label: "Gender" },
        filterFn: "arrIncludesSome",

        cell: ({ getValue }) =>
          renderComponent(Icon, ANIMALS.GENDER.MAP[getValue()]),
      }),

      accessor("date_of_birth", {
        meta: { label: "Age" },

        filterFn: TanstackTable.filter_fns.date_range,

        cell: ({ getValue }) =>
          renderComponent(Time, {
            date: getValue(),
            show: (dt) =>
              Format.date_distance(dt, {
                suffix: false,
                numeric: "always",
                style: "short",
              }),
          }),
      }),

      accessor("intake_date", {
        meta: { label: "Intake" },

        cell: ({ getValue }) =>
          renderComponent(Time, {
            date: getValue(),
            show: "date_distance",
          }),
      }),
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
  }),
);
