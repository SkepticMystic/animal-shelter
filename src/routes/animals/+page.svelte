<script lang="ts">
  import AnimalCard from "$lib/components/cards/AnimalCard.svelte";
  import SvelteTable from "$lib/components/tables/SvelteTable.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
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
    <div class="flex flex-wrap gap-3">
      {#each [1, 2, 3, 4] as _}
        <Skeleton class={STYLES.CARD.SIZE} />
      {/each}
    </div>
  {:then animals}
    <SvelteTable
      {columns}
      data={animals}
      states={{ sorting: [{ id: "intake_date", desc: true }] }}
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
            placeholder="Species"
            options={ANIMALS.SPECIES.OPTIONS}
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

          {#if table.getState().columnFilters.length}
            <Button
              icon="lucide/x"
              variant="ghost"
              onclick={() => table.resetColumnFilters()}
            />
          {/if}
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
