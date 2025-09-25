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

<article>
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
    <dl>
      <div>
        <dt>Shelter</dt>
        <dd>
          <ShelterLink shelter={data.animal.shelter} />
        </dd>
      </div>

      <div>
        <dt>Status</dt>
        <dd>{ANIMALS.STATUS.MAP[animal.status].label}</dd>
      </div>

      <div>
        <dt>Gender</dt>
        <dd>
          <Icon {...ANIMALS.GENDER.MAP[animal.gender]} />
        </dd>
      </div>

      <div>
        <dt>Species</dt>
        <dd>
          <Icon {...ANIMALS.SPECIES.MAP[animal.species]} />
        </dd>
      </div>

      <div>
        <dt>Breed</dt>
        <dd>{animal.breed}</dd>
      </div>

      <div>
        <dt>Sterilized</dt>
        <dd>{animal.sterilised ? "Yes" : "No"}</dd>
      </div>

      <div>
        <dt>Microchipped</dt>
        <dd>{animal.microchip_number ? "Yes" : "No"}</dd>
      </div>

      <div>
        <dt>Age</dt>
        <dd>
          {Format.date_distance(animal.date_of_birth, {
            suffix: false,
            numeric: "always",
          }) || "Unknown"}
        </dd>
      </div>

      <div>
        <dt>Intake date</dt>
        <dd>{Format.date(animal.intake_date)}</dd>
      </div>
    </dl>
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
    <section>
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
