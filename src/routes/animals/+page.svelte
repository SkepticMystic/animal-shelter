<script lang="ts">
  import AnimalCard from "$lib/components/cards/AnimalCard.svelte";
  import SvelteTable from "$lib/components/tables/SvelteTable.svelte";
  import TanTableResetColumnFiltersButton from "$lib/components/tables/TanTableResetColumnFiltersButton.svelte";
  import DateRangePicker from "$lib/components/ui/date-picker/DateRangePicker.svelte";
  import Input from "$lib/components/ui/input/input.svelte";
  import MultiSelect from "$lib/components/ui/select/MultiSelect.svelte";
  import Skeleton from "$lib/components/ui/skeleton/skeleton.svelte";
  import { ANIMALS } from "$lib/const/animal.const";
  import { STYLES } from "$lib/const/styles.const";
  import { get_animals_remote } from "$lib/remote/animal.remote";
  import type { DateRange } from "bits-ui";
  import { columns } from "./columns";

  const get_animals = get_animals_remote({
    where: { status: { ne: "deceased" } },
  });
</script>

<article>
  <header>
    <h1>Animals</h1>
  </header>

  {#await get_animals}
    <div class="space-y-3">
      <Skeleton class="h-9 w-full" />
      <div class="flex flex-wrap gap-3">
        {#each [1, 2, 3, 4] as _ (_)}
          <Skeleton class={STYLES.CARD.SIZE} />
        {/each}
      </div>
    </div>
  {:then animals}
    <SvelteTable
      {columns}
      data={animals}
      states={{
        sorting: [{ id: "intake_date", desc: true }],
        column_filters: [{ id: "status", value: ["available"] }],
      }}
    >
      {#snippet children(table)}
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
            placeholder="Status"
            options={ANIMALS.STATUS.OPTIONS.filter(
              (s) => s.value !== "deceased",
            )}
            bind:value={
              () =>
                (table.getColumn("status")?.getFilterValue() ?? []) as string[],
              (value) => table.getColumn("status")?.setFilterValue(value)
            }
          />

          <MultiSelect
            placeholder="Species"
            options={ANIMALS.SPECIES.OPTIONS}
            bind:value={
              () =>
                (table.getColumn("species")?.getFilterValue() ??
                  []) as string[],
              (value) => table.getColumn("species")?.setFilterValue(value)
            }
          />

          <MultiSelect
            placeholder="Traits"
            options={ANIMALS.TRAITS.OPTIONS}
            bind:value={
              () =>
                (table.getColumn("traits")?.getFilterValue() ?? []) as string[],
              (value) => table.getColumn("traits")?.setFilterValue(value)
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

        <div class="flex flex-wrap gap-3">
          {#each table.getRowModel().rows as { original: animal } (animal.id)}
            <AnimalCard
              {animal}
              images={animal.images}
              shelter={animal.shelter}
            />
          {/each}
        </div>
      {/snippet}
    </SvelteTable>
  {:catch error}
    <p class="text-warning" {@attach () => console.error(error)}>
      Error loading animals
    </p>
  {/await}
</article>
