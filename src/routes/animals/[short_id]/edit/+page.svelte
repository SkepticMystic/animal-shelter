<script lang="ts">
  import { invalidateAll } from "$app/navigation";
  import { AnimalClient } from "$lib/clients/animal.client.js";
  import { ImageClient } from "$lib/clients/image.client.js";
  import BackButton from "$lib/components/buttons/BackButton.svelte";
  import AnimalForm from "$lib/components/form/animal/AnimalForm.svelte";
  import Image from "$lib/components/images/Image.svelte";
  import ImageUploader from "$lib/components/images/upload/ImageUploader.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import Separator from "$lib/components/ui/separator/separator.svelte";
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
      <div class="flex flex-col gap-2">
        <Image {image} height={100} width={100} />

        <Button
          icon="lucide/x"
          variant="destructive"
          title="Delete image"
          onclick={() =>
            ImageClient.delete(image.id).then((r) => {
              if (r.ok) {
                animal.images = Items.remove(animal.images, image.id);
              }
            })}
        >
          Delete
        </Button>
      </div>
    {/each}
  </div>
</div>
