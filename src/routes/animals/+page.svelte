<script lang="ts">
  import AnimalCard from "$lib/components/cards/AnimalCard.svelte";
  import Skeleton from "$lib/components/ui/skeleton/skeleton.svelte";
  import { get_animals_remote } from "$lib/remote/animal.remote";

  const get_animals = get_animals_remote({});
</script>

<article>
  <header class="flex items-center justify-between">
    <h1>Animals</h1>
  </header>

  {#await get_animals}
    <div class="flex flex-wrap gap-3">
      {#each [1, 2, 3] as _}
        <Skeleton class="mb-4 h-72 w-56" />
      {/each}
    </div>
  {:then animals}
    <div class="flex flex-wrap gap-3">
      {#each animals as animal}
        <AnimalCard {animal} images={animal.images} shelter={animal.shelter} />
      {/each}
    </div>
  {:catch error}
    <p class="text-warning" {@attach () => console.error(error)}>
      Error loading animals
    </p>
  {/await}
</article>
