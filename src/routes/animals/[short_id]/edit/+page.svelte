<script lang="ts">
  import { invalidateAll } from "$app/navigation";
  import { AnimalClient } from "$lib/clients/animal.client.js";
  import { AnimalEventClient } from "$lib/clients/animal_event.client.js";
  import BackButton from "$lib/components/buttons/BackButton.svelte";
  import AnimalForm from "$lib/components/form/animal/AnimalForm.svelte";
  import AnimalEventForm from "$lib/components/form/animal_event/AnimalEventForm.svelte";
  import Picture from "$lib/components/images/Picture.svelte";
  import PictureActionsWrapper from "$lib/components/images/PictureActionsWrapper.svelte";
  import ImageUploader from "$lib/components/images/upload/ImageUploader.svelte";
  import AnimalEventsDataTable from "$lib/components/tables/AnimalEventsDataTable.svelte";
  import Dialog from "$lib/components/ui/dialog/dialog.svelte";
  import Icon from "$lib/components/ui/icon/Icon.svelte";
  import Separator from "$lib/components/ui/separator/separator.svelte";
  import { ICONS } from "$lib/const/icon.const.js";
  import { IMAGES } from "$lib/const/image.const.js";
  import { Items } from "$lib/utils/items.util.js";

  let { data } = $props();

  let animal = $state(data.animal);
</script>

<div class="space-y-5">
  <div class="flex items-center gap-2">
    <BackButton />
    <h1>Edit {animal.name}</h1>
  </div>

  <AnimalForm
    form_input={data.animal_form_input}
    on_success={() => invalidateAll()}
    submit={(update) => AnimalClient.update(animal.id, update)}
  />

  <Separator />

  <div class="space-y-3">
    <div
      class="flex flex-col gap-2 md:flex-row md:items-center md:justify-between"
    >
      <h2>Images</h2>

      <ImageUploader
        resource_kind="animal"
        resource_id={animal.id}
        bind:images={animal.images}
      />
    </div>

    {#if animal.images.length === 0}
      <p class="text-sm text-muted-foreground">No images uploaded yet.</p>
    {:else}
      <div class="flex flex-wrap gap-3">
        {#each animal.images as image (image.id)}
          <PictureActionsWrapper
            {image}
            on_delete={() =>
              (animal.images = Items.remove(animal.images, image.id))}
          >
            <Picture {image} {...IMAGES.SIZES.THUMBNAIL} />
          </PictureActionsWrapper>
        {/each}
      </div>
    {/if}
  </div>

  <Separator />

  <div class="space-y-3">
    <div class="flex items-center justify-between">
      <h2>Events</h2>

      <Dialog title="Add event" description="Add a new event for {animal.name}">
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
    </div>

    <AnimalEventsDataTable
      visibility={{ animal: false }}
      rows={animal.events.map((e) => ({ ...e, animal }))}
    />
  </div>
</div>
