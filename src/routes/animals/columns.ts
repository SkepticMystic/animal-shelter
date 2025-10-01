import type { get_animals_remote } from "$lib/remote/animal.remote";
import { TanstackTable } from "$lib/utils/tanstack/table.util.svelte";

type TData = Awaited<ReturnType<typeof get_animals_remote>>[number];

export const columns = TanstackTable.make_columns<TData>(({ accessor }) => ({
  columns: [
    accessor("name", {}),

    accessor("status", {
      filterFn: "arrIncludesSome",
    }),
    accessor("species", {
      filterFn: "arrIncludesSome",
    }),

    accessor("traits", {
      filterFn: "arrIncludesSome",
    }),

    accessor("gender", {
      filterFn: "arrIncludesSome",
    }),

    accessor("date_of_birth", {
      filterFn: TanstackTable.filter_fns.date_range,
    }),
    accessor("intake_date", {}),

    accessor("shelter.name", {
      filterFn: "arrIncludesSome",
    }),
  ],
}));
