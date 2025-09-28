<script lang="ts">
  import AnimalCard from "$lib/components/cards/AnimalCard.svelte";
  import Skeleton from "$lib/components/ui/skeleton/skeleton.svelte";
  import { STYLES } from "$lib/const/styles.const";
  import { get_animals_remote } from "$lib/remote/animal.remote";

  const get_animals = get_animals_remote({
    where: { status: { ne: "deceased" } },
  });
</script>

<article>
  <header class="flex items-center justify-between">
    <h1>Animals</h1>
  </header>

  {#await get_animals}
    <div class="flex flex-wrap gap-3">
      {#each [1, 2, 3, 4] as _}
        <Skeleton class={STYLES.CARD.SIZE} />
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
