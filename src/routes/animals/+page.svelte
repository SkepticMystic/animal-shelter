<script lang="ts">
  import { AnimalClient } from "$lib/clients/animal.client";
  import AnimalForm from "$lib/components/form/animal/AnimalForm.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import DataTable from "$lib/components/ui/data-table/data-table.svelte";
  import DateRangePicker from "$lib/components/ui/date-picker/DateRangePicker.svelte";
  import Dialog from "$lib/components/ui/dialog/dialog.svelte";
  import Icon from "$lib/components/ui/icon/Icon.svelte";
  import Input from "$lib/components/ui/input/input.svelte";
  import Loading from "$lib/components/ui/loading/Loading.svelte";
  import MultiSelect from "$lib/components/ui/select/MultiSelect.svelte";
  import { ANIMALS } from "$lib/const/animal.const";
  import { get_animals_remote } from "$lib/remote/animal.remote";
  import type { DateRange } from "bits-ui";
  import { columns } from "./columns";

  let { data } = $props();

  const get_animals = get_animals_remote({});
</script>

<div class="space-y-4">
  <div class="flex items-center justify-between">
    <h1>Animals</h1>

    <Dialog title="New Animal" description="Create a new animal">
      {#snippet trigger()}
        <Icon icon="lucide/plus" />
        New animal
      {/snippet}

      {#snippet content({ close })}
        <AnimalForm
          on_success={close}
          submit={AnimalClient.create}
          form_input={data.form_input}
        />
      {/snippet}
    </Dialog>
  </div>

  {#await get_animals}
    <Loading loading title="Fetching animals..." />
  {:then animals}
    <DataTable
      {columns}
      data={animals}
      states={{ sorting: [{ id: "createdAt", desc: true }] }}
    >
      {#snippet filters(table)}
        <div class="flex gap-1.5">
          <Input
            class="max-w-sm"
            placeholder="Filter by name"
            bind:value={
              () => table.getColumn("name")?.getFilterValue() ?? "",
              (value) => table.getColumn("name")?.setFilterValue(value)
            }
          />

          <MultiSelect
            options={ANIMALS.SPECIES.OPTIONS}
            placeholder="Filter by species"
            bind:value={
              () =>
                (table.getColumn("species")?.getFilterValue() ??
                  []) as string[],
              (value) => table.getColumn("species")?.setFilterValue(value)
            }
          />

          <DateRangePicker
            placeholder="Filter by date of birth"
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
            >
              Clear
            </Button>
          {/if}
        </div>
      {/snippet}
    </DataTable>
  {:catch error}
    <p class="text-warning" {@attach () => console.error(error)}>
      Error loading animals
    </p>
  {/await}
</div>
