<script lang="ts">
  import Button from "$lib/components/ui/button/button.svelte";
  import DataTable from "$lib/components/ui/data-table/data-table.svelte";
  import Input from "$lib/components/ui/input/input.svelte";
  import Loading from "$lib/components/ui/loading/Loading.svelte";
  import { get_shelters_remote } from "$lib/remote/shelter.remote";
  import { columns } from "./columns";

  const get_shelters = get_shelters_remote({});
</script>

<div class="space-y-4">
  <div class="flex items-center justify-between">
    <h1>Shelters</h1>
  </div>

  {#await get_shelters}
    <Loading loading title="Fetching shelters..." />
  {:then shelters}
    <DataTable
      {columns}
      data={shelters}
      states={{ sorting: [{ id: "createdAt", desc: true }] }}
    >
      {#snippet filters(table)}
        <div class="flex gap-1.5">
          <Input
            class="max-w-sm"
            placeholder="Name"
            bind:value={
              () => table.getColumn("name")?.getFilterValue() ?? "",
              (value) => table.getColumn("name")?.setFilterValue(value)
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
      {/snippet}
    </DataTable>
  {:catch error}
    <p class="text-warning" {@attach () => console.error(error)}>
      Error loading shelters
    </p>
  {/await}
</div>
