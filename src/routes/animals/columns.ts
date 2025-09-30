import type { get_animals_remote } from "$lib/remote/animal.remote";
import { TanstackTable } from "$lib/utils/tanstack/table.util.svelte";

type TData = Awaited<ReturnType<typeof get_animals_remote>>[number];

export const columns = TanstackTable.make_columns<TData>({
  columns: [
    {
      accessorKey: "name",
    },
    {
      accessorKey: "species",
      filterFn: "arrIncludesSome",
    },

    {
      accessorKey: "gender",
      filterFn: "arrIncludesSome",
    },

    {
      accessorKey: "date_of_birth",
      filterFn: TanstackTable.filter_fns.date_range,
    },
    {
      accessorKey: "intake_date",
    },

    {
      accessorKey: "shelter.name",
      filterFn: "arrIncludesSome",
    },
  ],
});
