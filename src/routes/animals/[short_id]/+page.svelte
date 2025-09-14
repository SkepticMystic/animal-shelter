<script lang="ts">
  import { resolve } from "$app/paths";
  import { AccessClient } from "$lib/clients/access_control.client.js";
  import { AnimalEventClient } from "$lib/clients/animal_event.client.js";
  import BackButton from "$lib/components/buttons/BackButton.svelte";
  import ShareButton from "$lib/components/buttons/ShareButton.svelte";
  import AnimalEventForm from "$lib/components/form/animal_event/AnimalEventForm.svelte";
  import Picture from "$lib/components/images/Picture.svelte";
  import AnimalEventsDataTable from "$lib/components/tables/AnimalEventsDataTable.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import Dialog from "$lib/components/ui/dialog/dialog.svelte";
  import Icon from "$lib/components/ui/icon/Icon.svelte";
  import { APP } from "$lib/const/app.js";
  import { ICONS } from "$lib/const/icon.const.js";
  import { IMAGES } from "$lib/const/image.const";
  import { ROUTES } from "$lib/const/routes.const.js";

  let { data } = $props();
  let animal = $state(data.animal);

  const share_data: ShareData = {
    title: animal.name,
    text: `Check out ${animal.name} on ${APP.NAME}`,
  };
</script>

<div class="space-y-5">
  <div class="flex justify-between">
    <div class="flex items-center gap-2">
      <BackButton />
      <h1>{animal.name}</h1>
    </div>

    <div class="flex items-center gap-2">
      <ShareButton data={share_data} />

      {#if AccessClient.org_owns(animal)}
        <Button
          variant="outline"
          icon={ICONS.EDIT}
          title="Edit {animal.name}"
          href={resolve(ROUTES.ANIMALS_EDIT, animal)}
        />
      {/if}
    </div>
  </div>

  <div class="flex flex-wrap gap-1">
    {#each animal.images as image}
      <Picture {image} {...IMAGES.SIZES.THUMBNAIL} alt="{animal.name} image" />
    {/each}
  </div>

  <div class="space-y-3">
    <div class="flex items-center justify-between">
      <h2>Events</h2>

      {#if AccessClient.org_owns(animal)}
        <Dialog
          title="Add event"
          description="Add a new event for {animal.name}"
        >
          {#snippet trigger()}
            <Icon icon={ICONS.ADD} />
            Add event
          {/snippet}

          {#snippet content({ close })}
            <AnimalEventForm
              mode="insert"
              form_input={data.event_form_input}
              submit={AnimalEventClient.create}
              on_success={(animal_event) => {
                animal.events = [...animal.events, animal_event];
                close();
              }}
            />
          {/snippet}
        </Dialog>
      {/if}
    </div>

    <AnimalEventsDataTable
      visibility={{ animal: false }}
      rows={animal.events.map((e) => ({ ...e, animal }))}
    />
  </div>
</div>
