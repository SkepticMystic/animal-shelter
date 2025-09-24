<script lang="ts">
  import { resolve } from "$app/paths";
  import BackButton from "$lib/components/buttons/BackButton.svelte";
  import Picture from "$lib/components/images/Picture.svelte";
  import GoogleMap from "$lib/components/map/GoogleMap.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import CarouselContent from "$lib/components/ui/carousel/carousel-content.svelte";
  import CarouselItem from "$lib/components/ui/carousel/carousel-item.svelte";
  import Carousel from "$lib/components/ui/carousel/Carousel.svelte";
  import Icon from "$lib/components/ui/icon/Icon.svelte";
  import Iconed from "$lib/components/ui/icon/Iconed.svelte";
  import { ANIMALS } from "$lib/const/animal.const";
  import { ICONS } from "$lib/const/icon.const.js";
  import { IMAGES } from "$lib/const/image.const";
  import { ROUTES } from "$lib/const/routes.const.js";
  import { Format } from "$lib/utils/format.util";

  let { data } = $props();
  let animal = $state(data.animal);
</script>

<div class="space-y-5">
  <div class="flex justify-between">
    <div class="flex items-center gap-2">
      <BackButton />
      <h1>{animal.name}</h1>
    </div>

    <div class="flex items-center gap-2">
      <Button
        variant="outline"
        icon={ICONS.EDIT}
        title="Edit {animal.name}"
        href={resolve(ROUTES.SHELTER_ANIMALS_EDIT, animal)}
      />
    </div>
  </div>

  <ul>
    <li>
      <span class="flex items-center gap-1">
        <strong>Status:</strong>
        {ANIMALS.STATUS.MAP[animal.status].label}
      </span>
    </li>

    <li>
      <span class="flex items-center gap-1">
        <strong>Gender:</strong>
        <Icon {...ANIMALS.GENDER.MAP[animal.gender]} />
      </span>
    </li>

    <li>
      <span class="flex items-center gap-1">
        <strong>Species:</strong>
        <Icon {...ANIMALS.SPECIES.MAP[animal.species]} />
      </span>
    </li>

    <li>
      <strong>Breed:</strong>
      {animal.breed}
    </li>

    <li>
      <strong>Age:</strong>
      {Format.date_distance(animal.date_of_birth, {
        suffix: false,
        numeric: "always",
      }) || "Unknown"}
    </li>

    <li>
      <strong>Intake date:</strong>
      {Format.date(animal.intake_date)}
    </li>
  </ul>

  <blockquote>
    {animal.description}
  </blockquote>

  {#if data.animal.images.length}
    <Carousel>
      {#snippet content()}
        <CarouselContent class="-ml-2 md:-ml-3">
          {#each data.animal.images as image, i (image.url)}
            <CarouselItem class="basis-auto pl-2 md:pl-3">
              <Picture {image} prioritize={i < 2} {...IMAGES.SIZES.PREVIEW} />
            </CarouselItem>
          {/each}
        </CarouselContent>
      {/snippet}
    </Carousel>
  {/if}

  {#if data.animal.shelter.place}
    <div class="space-y-2">
      <Iconed reversed icon="lucide/map-pin">
        <h2>Shelter</h2>
      </Iconed>

      <GoogleMap place={data.animal.shelter.place} />
    </div>
  {/if}
</div>
