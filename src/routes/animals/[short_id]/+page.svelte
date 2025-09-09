<script lang="ts">
  import BackButton from "$lib/components/buttons/BackButton.svelte";
  import Image from "$lib/components/images/Image.svelte";

  let { data } = $props();
</script>

<div class="flex items-center gap-2">
  <BackButton />
  <h1>{data.animal.name}</h1>
</div>

<!-- TODO: AnimalViewer -->
<pre>{JSON.stringify(data.animal, null, 2)}</pre>

<div class="flex flex-wrap gap-1">
  {#each data.animal.images as image}
    <Image {image} width={150} height={150} alt="{data.animal.name} image" />
  {/each}
</div>
