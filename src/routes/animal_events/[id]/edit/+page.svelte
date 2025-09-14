<script lang="ts">
  import { invalidateAll } from "$app/navigation";
  import { AnimalEventClient } from "$lib/clients/animal_event.client.js";
  import BackButton from "$lib/components/buttons/BackButton.svelte";
  import AnimalEventForm from "$lib/components/form/animal_event/AnimalEventForm.svelte";
  import Picture from "$lib/components/images/Picture.svelte";
  import PictureActionsWrapper from "$lib/components/images/PictureActionsWrapper.svelte";
  import ImageUploader from "$lib/components/images/upload/ImageUploader.svelte";
  import Separator from "$lib/components/ui/separator/separator.svelte";
  import { IMAGES } from "$lib/const/image.const.js";
  import { Items } from "$lib/utils/items.util.js";

  let { data } = $props();

  let animal_event = $state(data.animal_event);
</script>

<div class="mx-auto max-w-xl space-y-5">
  <div class="flex items-center gap-2">
    <BackButton />
    <h1>Edit event</h1>
  </div>

  <AnimalEventForm
    mode="update"
    form_input={data.form_input}
    on_success={() => invalidateAll()}
    submit={(update) => AnimalEventClient.update(animal_event.id, update)}
  />

  <Separator />

  <ImageUploader
    resource_kind="animal_event"
    resource_id={animal_event.id}
    on_upload={(image) => {
      animal_event.images = [...animal_event.images, image];
    }}
  />

  <div class="flex flex-wrap gap-3">
    {#each animal_event.images as image (image.id)}
      <PictureActionsWrapper
        {image}
        on_delete={() =>
          (animal_event.images = Items.remove(animal_event.images, image.id))}
      >
        <Picture {image} {...IMAGES.SIZES.THUMBNAIL} />
      </PictureActionsWrapper>
    {/each}
  </div>
</div>
