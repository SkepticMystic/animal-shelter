<script lang="ts">
  import { goto } from "$app/navigation";
  import { resolve } from "$app/paths";
  import { AnimalClient } from "$lib/clients/animal.client.js";
  import BackButton from "$lib/components/buttons/BackButton.svelte";
  import AnimalForm from "$lib/components/form/animal/AnimalForm.svelte";
  import { ROUTES } from "$lib/const/routes.const.js";
  let { data } = $props();
</script>

<div class="mx-auto w-fit space-y-5">
  <div class="flex items-center gap-2">
    <BackButton />
    <h1>Add a new animal</h1>
  </div>

  <AnimalForm
    form_input={data.form_input}
    submit={(insert) => AnimalClient.create(insert)}
    on_success={(animal) => goto(resolve(ROUTES.SHELTER_ANIMALS_EDIT, animal))}
  />
</div>
