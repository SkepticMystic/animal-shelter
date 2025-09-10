<script lang="ts">
  import BackButton from "$lib/components/buttons/BackButton.svelte";
  import AnimalCard from "$lib/components/cards/AnimalCard.svelte";

  let { data } = $props();
</script>

<BackButton />

<pre>{JSON.stringify(data.shelter, null, 2)}</pre>

<div class="flex flex-wrap gap-2">
  {#each data.shelter.animals as animal}
    <AnimalCard {animal} />
  {/each}
</div>
