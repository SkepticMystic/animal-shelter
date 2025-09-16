<script lang="ts">
  import { invalidateAll } from "$app/navigation";
  import { AnimalClient } from "$lib/clients/animal.client.js";
  import BackButton from "$lib/components/buttons/BackButton.svelte";
  import AnimalForm from "$lib/components/form/animal/AnimalForm.svelte";
  import Picture from "$lib/components/images/Picture.svelte";
  import PictureActionsWrapper from "$lib/components/images/PictureActionsWrapper.svelte";
  import ImageUploader from "$lib/components/images/upload/ImageUploader.svelte";
  import Separator from "$lib/components/ui/separator/separator.svelte";
  import { IMAGES } from "$lib/const/image.const.js";
  import { Items } from "$lib/utils/items.util.js";

  let { data } = $props();

  let animal = $state(data.animal);
</script>

<div class="mx-auto w-fit space-y-5">
  <div class="flex items-center gap-2">
    <BackButton />
    <h1>Edit {animal.name}</h1>
  </div>

  <AnimalForm
    form_input={data.form_input}
    on_success={() => invalidateAll()}
    submit={(update) => AnimalClient.update(animal.id, update)}
  />

  <Separator />

  <ImageUploader
    resource_kind="animal"
    resource_id={animal.id}
    on_upload={(image) => {
      animal.images = [...animal.images, image];
    }}
  />

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
</div>
