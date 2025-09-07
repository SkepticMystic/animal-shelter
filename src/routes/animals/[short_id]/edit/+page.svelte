<script lang="ts">
  import { invalidateAll } from "$app/navigation";
  import { AnimalClient } from "$lib/clients/animal.client.js";
  import AnimalForm from "$lib/components/form/animal/AnimalForm.svelte";

  let { data } = $props();
</script>

<AnimalForm
  form_input={data.form_input}
  on_success={() => invalidateAll()}
  submit={(patch) => AnimalClient.patch(data.animal.id, patch)}
/>
