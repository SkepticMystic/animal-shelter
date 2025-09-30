<script lang="ts">
  import BackButton from "$lib/components/buttons/BackButton.svelte";
  import TanTableResetColumnFiltersButton from "$lib/components/tables/TanTableResetColumnFiltersButton.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import DataTable from "$lib/components/ui/data-table/data-table.svelte";
  import DateRangePicker from "$lib/components/ui/date-picker/DateRangePicker.svelte";
  import Input from "$lib/components/ui/input/input.svelte";
  import Loading from "$lib/components/ui/loading/Loading.svelte";
  import MultiSelect from "$lib/components/ui/select/MultiSelect.svelte";
  import { ANIMALS } from "$lib/const/animal.const";
  import { ROUTES } from "$lib/const/routes.const";
  import { get_shelter_animals_remote } from "$lib/remote/animal.remote";
  import type { DateRange } from "bits-ui";
  import { columns } from "./columns";

  const get_animals = get_shelter_animals_remote({});
</script>

<article>
  <header class="flex items-center justify-between">
    <div class="flex items-center gap-2">
      <BackButton />
      <h1>Animals</h1>
    </div>

    <Button icon="lucide/plus" href={ROUTES.SHELTER_ANIMALS_CREATE}>
      New animal
    </Button>
  </header>

  {#await get_animals}
    <Loading loading title="Fetching animals..." />
  {:then animals}
    <DataTable
      {columns}
      faceting
      data={animals}
      states={{ sorting: [{ id: "intake_date", desc: true }] }}
    >
      {#snippet filters(table)}
        <div class="flex flex-wrap gap-1">
          <Input
            class="w-32"
            placeholder="Name"
            bind:value={
              () => table.getColumn("name")?.getFilterValue() ?? "",
              (value) => table.getColumn("name")?.setFilterValue(value)
            }
          />

          <MultiSelect
            options={ANIMALS.SPECIES.OPTIONS}
            placeholder="Species"
            bind:value={
              () =>
                (table.getColumn("species")?.getFilterValue() ??
                  []) as string[],
              (value) => table.getColumn("species")?.setFilterValue(value)
            }
          />

          <DateRangePicker
            placeholder="Date of birth"
            bind:value={
              () =>
                table.getColumn("date_of_birth")?.getFilterValue() as
                  | DateRange
                  | undefined,
              (value) => table.getColumn("date_of_birth")?.setFilterValue(value)
            }
          />

          <TanTableResetColumnFiltersButton {table} />
        </div>
      {/snippet}
    </DataTable>
  {:catch error}
    <p class="text-warning" {@attach () => console.error(error)}>
      Error loading animals
    </p>
  {/await}
</article>
