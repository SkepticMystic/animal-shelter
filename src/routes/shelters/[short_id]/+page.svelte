<script lang="ts">
  import BackButton from "$lib/components/buttons/BackButton.svelte";
  import AnimalCard from "$lib/components/cards/AnimalCard.svelte";
  import Picture from "$lib/components/images/Picture.svelte";
  import EmailLink from "$lib/components/links/EmailLink.svelte";
  import ExternalLink from "$lib/components/links/ExternalLink.svelte";
  import TelLink from "$lib/components/links/TelLink.svelte";
  import GoogleMap from "$lib/components/map/GoogleMap.svelte";
  import CarouselContent from "$lib/components/ui/carousel/carousel-content.svelte";
  import CarouselItem from "$lib/components/ui/carousel/carousel-item.svelte";
  import Carousel from "$lib/components/ui/carousel/Carousel.svelte";
  import Iconed from "$lib/components/ui/icon/Iconed.svelte";
  import { IMAGES } from "$lib/const/image.const";

  let { data } = $props();
</script>

<div class="space-y-7">
  <div class="flex items-center gap-2">
    <BackButton />
    <h1>{data.shelter.name}</h1>
  </div>

  <div class="flex items-start justify-between">
    <div class="flex flex-wrap justify-start gap-3">
      {#each data.shelter.urls as link}
        <ExternalLink {link} />
      {/each}
    </div>

    <div class="flex flex-wrap justify-end gap-3">
      {#each data.shelter.emails as link}
        <EmailLink {link} />
      {/each}
      {#each data.shelter.phones as link}
        <TelLink {link} />
      {/each}
    </div>
  </div>

  {#if data.shelter.animals.length}
    <div class="flex flex-wrap gap-3">
      {#each [...data.shelter.animals, ...data.shelter.animals, ...data.shelter.animals] as animal}
        <AnimalCard {animal} />
      {/each}
    </div>
  {/if}

  {#if data.shelter.images.length}
    <Carousel>
      {#snippet content()}
        <CarouselContent class="-ml-2 md:-ml-4">
          {#each data.shelter.images as image}
            <CarouselItem class="pl-2 sm:basis-1/2 md:basis-1/3 md:pl-4">
              <Picture {image} {...IMAGES.SIZES.PREVIEW} />
            </CarouselItem>
          {/each}
        </CarouselContent>
      {/snippet}
    </Carousel>
  {/if}

  {#if data.shelter.place}
    <div class="space-y-2">
      <Iconed reversed icon="lucide/map-pin">
        <h2>Location</h2>
      </Iconed>

      <GoogleMap place={data.shelter.place} />
    </div>
  {/if}
</div>
