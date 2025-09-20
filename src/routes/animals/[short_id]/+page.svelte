<script lang="ts">
  import { resolve } from "$app/paths";
  import { AccessClient } from "$lib/clients/access_control.client.js";
  import BackButton from "$lib/components/buttons/BackButton.svelte";
  import ShareButton from "$lib/components/buttons/ShareButton.svelte";
  import Picture from "$lib/components/images/Picture.svelte";
  import ShelterLink from "$lib/components/links/ShelterLink.svelte";
  import GoogleMap from "$lib/components/map/GoogleMap.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import CarouselContent from "$lib/components/ui/carousel/carousel-content.svelte";
  import CarouselItem from "$lib/components/ui/carousel/carousel-item.svelte";
  import Carousel from "$lib/components/ui/carousel/Carousel.svelte";
  import Icon from "$lib/components/ui/icon/Icon.svelte";
  import Iconed from "$lib/components/ui/icon/Iconed.svelte";
  import { ANIMALS } from "$lib/const/animal.const";
  import { APP } from "$lib/const/app.js";
  import { ICONS } from "$lib/const/icon.const.js";
  import { IMAGES } from "$lib/const/image.const";
  import { ROUTES } from "$lib/const/routes.const.js";
  import { Format } from "$lib/utils/format.util";

  let { data } = $props();
  let animal = $state(data.animal);

  const share_data: ShareData = {
    title: animal.name,
    text: `Check out ${animal.name} on ${APP.NAME}`,
  };
</script>

<div class="space-y-5">
  <div class="flex justify-between">
    <div class="flex items-center gap-2">
      <BackButton />
      <h1>{animal.name}</h1>
    </div>

    <div class="flex items-center gap-2">
      <ShareButton data={share_data} />

      {#if AccessClient.org_owns(animal)}
        <Button
          variant="outline"
          icon={ICONS.EDIT}
          title="Edit {animal.name}"
          href={resolve(ROUTES.ANIMALS_EDIT, animal)}
        />
      {/if}
    </div>
  </div>

  <ul>
    <li>
      <span class="flex items-center gap-1">
        <strong>Shelter:</strong>
        <ShelterLink shelter={data.animal.shelter} />
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
          {#each data.animal.images as image}
            <CarouselItem class="basis-auto pl-2 md:pl-3">
              <Picture {image} {...IMAGES.SIZES.PREVIEW} />
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
