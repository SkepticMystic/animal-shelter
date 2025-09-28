<script lang="ts">
  import { resolve } from "$app/paths";
  import { AccessClient } from "$lib/clients/access_control.client.js";
  import BackButton from "$lib/components/buttons/BackButton.svelte";
  import ShareButton from "$lib/components/buttons/ShareButton.svelte";
  import AnimalCard from "$lib/components/cards/AnimalCard.svelte";
  import Picture from "$lib/components/images/Picture.svelte";
  import ShelterLink from "$lib/components/links/ShelterLink.svelte";
  import GoogleMap from "$lib/components/map/GoogleMap.svelte";
  import PrerenderedMarkdown from "$lib/components/text/PrerenderedMarkdown.svelte";
  import Time from "$lib/components/Time.svelte";
  import Badge from "$lib/components/ui/badge/badge.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import ItemCarousel from "$lib/components/ui/carousel/ItemCarousel.svelte";
  import Icon from "$lib/components/ui/icon/Icon.svelte";
  import Iconed from "$lib/components/ui/icon/Iconed.svelte";
  import Separator from "$lib/components/ui/separator/separator.svelte";
  import Skeleton from "$lib/components/ui/skeleton/skeleton.svelte";
  import { ANIMALS } from "$lib/const/animal.const";
  import { APP } from "$lib/const/app.js";
  import { ICONS } from "$lib/const/icon.const.js";
  import { IMAGES } from "$lib/const/image.const";
  import { ROUTES } from "$lib/const/routes.const.js";
  import { STYLES } from "$lib/const/styles.const.js";
  import { get_animals_remote } from "$lib/remote/animal.remote.js";
  import { Format } from "$lib/utils/format.util";

  let { data } = $props();

  const share_data: ShareData = {
    title: data.animal.name,
    text: `Check out ${data.animal.name} on ${APP.NAME}`,
  };

  const related_animals = $derived(
    get_animals_remote({
      where: {
        id: { ne: data.animal.id },
        org_id: { eq: data.animal.org_id },
        species: { eq: data.animal.species },
      },

      pagination: { limit: 5 },
    }),
  );
</script>

<article>
  <header class="flex justify-between">
    <div class="flex items-center gap-2">
      <BackButton />
      <h1>{data.animal.name}</h1>
    </div>

    <div class="flex items-center gap-2">
      {#if AccessClient.member_can( { animal: ["update"] }, ) && AccessClient.org_owns(data.animal)}
        <Button
          icon={ICONS.EDIT}
          title="Edit animal"
          href={resolve(ROUTES.SHELTER_ANIMALS_EDIT, data.animal)}
        />
      {/if}

      <ShareButton data={share_data} />
    </div>
  </header>

  <section>
    <dl>
      <div>
        <dt class="sr-only">Status</dt>
        <dd>
          <Badge variant={ANIMALS.STATUS.MAP[data.animal.status].variant}>
            {ANIMALS.STATUS.MAP[data.animal.status].label}
          </Badge>
        </dd>
      </div>

      <div>
        <dt>Age</dt>
        <dd>
          <Time
            date={data.animal.date_of_birth}
            show={(dt) =>
              dt
                ? Format.date_distance(dt, {
                    suffix: "old",
                    style: "short",
                    numeric: "always",
                  })
                : "Unknown"}
          />
        </dd>
      </div>

      <div>
        <dt>Gender</dt>
        <dd>
          <Icon {...ANIMALS.GENDER.MAP[data.animal.gender]} />
        </dd>
      </div>

      <div>
        <dt>Species</dt>
        <dd>
          <Icon {...ANIMALS.SPECIES.MAP[data.animal.species]} />
        </dd>

        {#if data.animal.breed}
          <span class="flex">
            (
            <dt class="sr-only">Breed</dt>
            <dd>{data.animal.breed}</dd>
            )
          </span>
        {/if}
      </div>

      <div>
        <dt>Sterilized</dt>
        <dd>{data.animal.sterilised ? "Yes" : "No"}</dd>
      </div>

      <div>
        <dt>Microchipped</dt>
        <dd>{data.animal.microchip_number ? "Yes" : "No"}</dd>
      </div>

      <div>
        <dt>Shelter</dt>
        <dd>
          <ShelterLink shelter={data.animal.shelter} />
        </dd>

        {#if data.animal.intake_date}
          <span class="flex gap-1">
            since
            <dt class="sr-only">Intake date</dt>
            <dd>{Format.date(data.animal.intake_date)}</dd>
          </span>
        {/if}
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
      Last updated: <em>{Format.datetime(data.animal.updatedAt)}</em>
    </p>
  </footer>

  <aside class="space-y-3">
    <Separator />

    <h3>
      Other <span class="lowercase">
        {ANIMALS.SPECIES.MAP[data.animal.species].label}s
      </span>
      at <ShelterLink shelter={data.animal.shelter} />
    </h3>

    {#await related_animals}
      <div class="flex flex-wrap gap-3">
        {#each [1, 2, 3, 4] as _}
          <Skeleton class={STYLES.CARD.SIZE} />
        {/each}
      </div>
    {:then related}
      {#if related.length}
        <ItemCarousel items={related}>
          {#snippet item(animal)}
            <AnimalCard {animal} images={animal.images} />
          {/snippet}
        </ItemCarousel>
      {:else}
        <p>No other {ANIMALS.SPECIES.MAP[data.animal.species].label}s found.</p>
      {/if}
    {:catch error}
      <p class="text-warning" {@attach () => console.error(error)}>
        Error loading related animals
      </p>
    {/await}
  </aside>
</article>
