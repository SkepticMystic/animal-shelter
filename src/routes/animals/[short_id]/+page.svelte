<script lang="ts">
  import { resolve } from "$app/paths";
  import BackButton from "$lib/components/buttons/BackButton.svelte";
  import Picture from "$lib/components/images/Picture.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import { ICONS } from "$lib/const/icon.const.js";
  import { IMAGES } from "$lib/const/image.const";

  let { data } = $props();
</script>

<div class="flex justify-between">
  <div class="flex items-center gap-2">
    <BackButton />
    <h1>{data.animal.name}</h1>
  </div>

  <Button
    variant="outline"
    icon={ICONS.EDIT}
    title="Edit {data.animal.name}"
    href={resolve("/animals/[short_id]/edit", data.animal)}
  />
</div>

<!-- TODO: AnimalViewer -->
<pre>{JSON.stringify(data.animal, null, 2)}</pre>

<div class="flex flex-wrap gap-1">
  {#each data.animal.images as image}
    <Picture
      {image}
      {...IMAGES.SIZES.THUMBNAIL}
      alt="{data.animal.name} image"
    />
  {/each}
</div>
