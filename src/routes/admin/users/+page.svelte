<script lang="ts">
  import BackButton from "$lib/components/buttons/BackButton.svelte";
  import DataTable from "$lib/components/ui/data-table/data-table.svelte";
  import { columns } from "./columns.js";

  let { data } = $props();
  let users = $state(data.users);
</script>

<div class="space-y-3">
  <div class="flex items-center gap-2">
    <BackButton />
    <h1>Users</h1>
  </div>

  <DataTable {columns} data={users}></DataTable>
</div>
