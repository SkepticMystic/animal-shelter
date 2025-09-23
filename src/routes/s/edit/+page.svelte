<script lang="ts">
  import { ShelterClient } from "$lib/clients/shelter.client.js";
  import ShelterForm from "$lib/components/form/shelter/ShelterForm.svelte";
  import Picture from "$lib/components/images/Picture.svelte";
  import PictureActionsWrapper from "$lib/components/images/PictureActionsWrapper.svelte";
  import ImageUploader from "$lib/components/images/upload/ImageUploader.svelte";
  import Separator from "$lib/components/ui/separator/separator.svelte";
  import { IMAGES } from "$lib/const/image.const.js";
  import { Items } from "$lib/utils/items.util.js";

  let { data } = $props();

  let shelter = $state(data.shelter);
  let images = $derived(shelter.images ?? []);
</script>

<div class="space-y-5">
  <div class="flex items-center gap-2">
    <Picture
      {...IMAGES.SIZES.AVATAR}
      image={images.at(0)}
      fallback={shelter.name.at(0)}
    />

    <h1>{shelter.name}</h1>
  </div>

  <div class="space-y-5">
    <ShelterForm
      form_input={data.update_shelter_form_input}
      submit={(update) => ShelterClient.update(shelter.id, update)}
      on_success={(updated) => (shelter = { ...updated, images })}
    />

    <Separator />

    <ImageUploader
      resource_kind="shelter"
      resource_id={shelter.id}
      bind:images
    />

    <div class="flex flex-wrap gap-3">
      {#each images as image (image.id)}
        <PictureActionsWrapper
          {image}
          on_delete={() => (images = Items.remove(images, image.id))}
        >
          <Picture {image} height={150} width={150} />
        </PictureActionsWrapper>
      {/each}
    </div>
  </div>
</div>
