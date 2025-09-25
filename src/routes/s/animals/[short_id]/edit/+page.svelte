<script lang="ts">
  import { invalidateAll } from "$app/navigation";
  import { resolve } from "$app/paths";
  import { AnimalClient } from "$lib/clients/animal.client.js";
  import BackButton from "$lib/components/buttons/BackButton.svelte";
  import AnimalForm from "$lib/components/form/animal/AnimalForm.svelte";
  import Picture from "$lib/components/images/Picture.svelte";
  import PictureActionsWrapper from "$lib/components/images/PictureActionsWrapper.svelte";
  import ImageUploader from "$lib/components/images/upload/ImageUploader.svelte";
  import AnimalEventsDataTable from "$lib/components/tables/AnimalEventsDataTable.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import Separator from "$lib/components/ui/separator/separator.svelte";
  import { ICONS } from "$lib/const/icon.const.js";
  import { IMAGES } from "$lib/const/image.const.js";
  import { ROUTES } from "$lib/const/routes.const.js";
  import { App } from "$lib/utils/app.js";
  import { Items } from "$lib/utils/items.util.js";

  let { data } = $props();

  let animal = $state(data.animal);
</script>

<article>
  <header class="flex items-center gap-2">
    <BackButton href={resolve(ROUTES.ANIMALS_VIEW, animal)} />
    <h1>Edit {animal.name}</h1>
  </header>

  <AnimalForm
    form_input={data.animal_form_input}
    on_success={() => invalidateAll()}
    submit={(update) => AnimalClient.update(animal.id, update)}
  />

  <Separator />

  <section>
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
  </section>

  <Separator />

  <section>
    <div class="flex items-center justify-between">
      <h2>Events</h2>

      <Button
        icon={ICONS.ADD}
        href={App.url(ROUTES.SHELTER_ANIMAL_EVENTS_CREATE, {
          animal_id: animal.id,
        })}
      >
        Add event
      </Button>
    </div>

    <AnimalEventsDataTable
      visibility={{ animal: false }}
      rows={animal.events.map((e) => ({ ...e, animal }))}
    />
  </section>
</article>
