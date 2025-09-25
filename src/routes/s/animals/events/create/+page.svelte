<script lang="ts">
  import { goto } from "$app/navigation";
  import { resolve } from "$app/paths";
  import { AnimalEventClient } from "$lib/clients/animal_event.client.js";
  import BackButton from "$lib/components/buttons/BackButton.svelte";
  import AnimalEventForm from "$lib/components/form/animal_event/AnimalEventForm.svelte";
  import { ROUTES } from "$lib/const/routes.const.js";
  let { data } = $props();
</script>

<article>
  <header class="flex items-center gap-2">
    <BackButton />
    <h1>Add a new animal event</h1>
  </header>

  <AnimalEventForm
    mode="insert"
    form_input={data.form_input}
    submit={(insert) => AnimalEventClient.create(insert)}
    on_success={({ animal_event }) =>
      goto(resolve(ROUTES.SHELTER_ANIMAL_EVENTS_EDIT, animal_event))}
  />
</article>
