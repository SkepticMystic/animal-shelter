<script lang="ts">
  import { resolve } from "$app/paths";
  import { AccessClient } from "$lib/clients/access_control.client.js";
  import BackButton from "$lib/components/buttons/BackButton.svelte";
  import ShareButton from "$lib/components/buttons/ShareButton.svelte";
  import Picture from "$lib/components/images/Picture.svelte";
  import ShelterLink from "$lib/components/links/ShelterLink.svelte";
  import GoogleMap from "$lib/components/map/GoogleMap.svelte";
  import PrerenderedMarkdown from "$lib/components/text/PrerenderedMarkdown.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import ItemCarousel from "$lib/components/ui/carousel/ItemCarousel.svelte";
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

<article class="space-y-5">
  <header class="flex justify-between">
    <div class="flex items-center gap-2">
      <BackButton />
      <h1>{animal.name}</h1>
    </div>

    <div class="flex items-center gap-2">
      {#if AccessClient.member_can( { animal: ["update"] }, ) && AccessClient.org_owns(animal)}
        <Button
          icon={ICONS.EDIT}
          title="Edit animal"
          href={resolve(ROUTES.SHELTER_ANIMALS_EDIT, animal)}
        />
      {/if}

      <ShareButton data={share_data} />
    </div>
  </header>

  <section>
    <ul>
      <li>
        <span class="flex items-center gap-1">
          <strong>Shelter:</strong>
          <ShelterLink shelter={data.animal.shelter} />
        </span>
      </li>
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
  </section>

  {#if data.prerendered.description}
    <section>
      <blockquote>
        <PrerenderedMarkdown html={data.prerendered.description} />
      </blockquote>
    </section>
  {/if}

  {#if data.animal.images.length}
    <section>
      <ItemCarousel items={data.animal.images}>
        {#snippet item(image, i)}
          <Picture {image} {...IMAGES.SIZES.PREVIEW} prioritize={i < 2} />
        {/snippet}
      </ItemCarousel>
    </section>
  {/if}

  {#if data.animal.shelter.place}
    <section class="space-y-2">
      <Iconed reversed icon="lucide/map-pin">
        <h2>Shelter</h2>
      </Iconed>

      <GoogleMap place={data.animal.shelter.place} />
    </section>
  {/if}

  <footer>
    <p class="text-sm text-muted-foreground">
      Last updated: <em>{Format.datetime(animal.updatedAt)}</em>
    </p>
  </footer>
</article>
