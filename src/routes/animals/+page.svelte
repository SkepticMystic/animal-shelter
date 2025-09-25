<script lang="ts">
  import AnimalCard from "$lib/components/cards/AnimalCard.svelte";
  import Loading from "$lib/components/ui/loading/Loading.svelte";
  import { get_animals_remote } from "$lib/remote/animal.remote";

  const get_animals = get_animals_remote({});
</script>

<article>
  <header class="flex items-center justify-between">
    <h1>Animals</h1>
  </header>

  {#await get_animals}
    <Loading loading title="Fetching animals..." />
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
