<script lang="ts">
  import { resolve } from "$app/paths";
  import { AccessClient } from "$lib/clients/access_control.client.js";
  import ShareButton from "$lib/components/buttons/ShareButton.svelte";
  import AnimalCard from "$lib/components/cards/AnimalCard.svelte";
  import Picture from "$lib/components/images/Picture.svelte";
  import ShelterLink from "$lib/components/links/ShelterLink.svelte";
  import GoogleMap from "$lib/components/map/GoogleMap.svelte";
  import PrerenderedMarkdown from "$lib/components/text/PrerenderedMarkdown.svelte";
  import Badge from "$lib/components/ui/badge/badge.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import Card from "$lib/components/ui/card/Card.svelte";
  import ItemCarousel from "$lib/components/ui/carousel/ItemCarousel.svelte";
  import Iconed from "$lib/components/ui/icon/Iconed.svelte";
  import ItemGroup from "$lib/components/ui/item/item-group.svelte";
  import Item from "$lib/components/ui/item/Item.svelte";
  import Separator from "$lib/components/ui/separator/separator.svelte";
  import Skeleton from "$lib/components/ui/skeleton/skeleton.svelte";
  import { ANIMALS } from "$lib/const/animal.const.js";
  import { APP } from "$lib/const/app.js";
  import { ICONS } from "$lib/const/icon.const.js";
  import { ROUTES } from "$lib/const/routes.const.js";
  import { STYLES } from "$lib/const/styles.const.js";
  import { get_animals_remote } from "$lib/remote/animal.remote.js";
  import type { Image } from "$lib/server/db/schema/image.model.js";
  import { Format } from "$lib/utils/format.util";

  let { data } = $props();

  const animal = $derived.by(() => {
    const _ = $state(data.animal);
    return _;
  });

  // TODO: Show other images in a carousel
  const [banner_image, ...other_images] = $derived(
    animal.images as [Image | undefined, ...Image[]],
  );

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

      pagination: { limit: 10 },
    }),
  );
</script>

<article class="min-h-screen">
  <div class="relative h-[500px] w-full overflow-hidden">
    <Picture
      prioritize
      height={500}
      aspectRatio={16 / 9}
      alt={animal.name}
      image={banner_image}
    />

    <div
      class="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent"
    ></div>

    <div class="absolute right-0 bottom-0 left-0 p-4 sm:p-8">
      <header
        class="flex flex-col justify-between gap-2 sm:flex-row sm:items-end"
      >
        <div>
          <h1 class="font-serif">
            {animal.name}
          </h1>

          <p class="text-xl text-muted-foreground">
            {animal.breed} • {ANIMALS.GENDER.MAP[animal.gender].label}
          </p>
        </div>

        <div class="flex items-center gap-1.5">
          <ShareButton data={share_data} />

          {#if AccessClient.member_can( { animal: ["update"] }, ) && AccessClient.org_owns(data.animal)}
            <Button
              variant="outline"
              icon={ICONS.EDIT}
              title="Edit animal"
              href={resolve(ROUTES.SHELTER_ANIMALS_EDIT, data.animal)}
            />
          {/if}

          <Badge {...ANIMALS.STATUS.MAP[animal.status]} class="text-lg" />
        </div>
      </header>
    </div>
  </div>

  <div class="grid gap-8 pt-6 pb-3 md:pt-12 lg:grid-cols-3">
    <div class="space-y-8 lg:col-span-2">
      {#if data.prerendered.description}
        <section>
          <h2 class="font-serif">
            About {animal.name}
          </h2>

          <PrerenderedMarkdown html={data.prerendered.description} />
        </section>
      {/if}

      {#if animal.traits.length}
        <section>
          <h2 class="font-serif">Traits</h2>

          <div class="flex flex-wrap gap-2">
            {#each animal.traits as trait (trait)}
              <Badge
                variant="secondary"
                class="px-4 py-2 text-base"
                {...ANIMALS.TRAITS.MAP[trait]}
              />
            {/each}
          </div>
        </section>
      {/if}

      <!-- {#if other_images.length}
        <section>
          <h2 class="font-serif">More Photos</h2>

          <ItemCarousel items={other_images}>
            {#snippet item(image, i)}
              <Picture {image} {...IMAGES.SIZES.PREVIEW} prioritize={i < 2} />
            {/snippet}
          </ItemCarousel>
        </section>
      {/if} -->

      {#if data.animal.shelter.place}
        <section>
          <h2 class="font-serif">Shelter</h2>

          <GoogleMap place={data.animal.shelter.place} />
        </section>
      {/if}
    </div>

    <div class="space-y-4">
      <section>
        <Card>
          {#snippet title()}
            <Iconed icon="lucide/info" class="h-6 w-6">
              <h3 class="font-serif">Quick Info</h3>
            </Iconed>
          {/snippet}

          {#snippet content()}
            <ItemGroup>
              <Item
                title="Age"
                class="px-0 py-1.5"
                icon="lucide/calendar text-primary"
                description={animal.date_of_birth
                  ? Format.date_distance(animal.date_of_birth, {
                      suffix: "old",
                      numeric: "always",
                    })
                  : "Unknown"}
              ></Item>

              <Item
                title="Species"
                class="px-0 py-1.5"
                icon="lucide/ruler text-primary"
                description={ANIMALS.SPECIES.MAP[animal.species].label}
              ></Item>

              <Item
                title="Sterilised"
                class="px-0 py-1.5"
                icon="lucide/stethoscope text-primary"
                description={animal.sterilised ? "Yes" : "No"}
              ></Item>

              <Item
                title="Shelter"
                class="px-0 py-1.5"
                icon="lucide/home text-primary"
              >
                {#snippet description()}
                  <ShelterLink shelter={animal.shelter} />
                {/snippet}
              </Item>

              <Item
                title="Intake Date"
                class="px-0 py-1.5"
                icon="lucide/map-pin text-primary"
                description={animal.intake_date
                  ? Format.date(animal.intake_date)
                  : "Unknown"}
              ></Item>
            </ItemGroup>
          {/snippet}
        </Card>
      </section>

      <Card
        description="{animal.name} is waiting for a loving home. Contact us today to learn more about the adoption process."
      >
        {#snippet title()}
          <Iconed icon="lucide/heart" class="h-6 w-6">
            <h3 class="font-serif">Ready to Adopt?</h3>
          </Iconed>
        {/snippet}

        {#snippet content()}
          <Button size="lg" class="w-full">Start Adoption Process</Button>
        {/snippet}
      </Card>

      <Card
        description="Have questions about {animal.name}? We're here to help!"
      >
        {#snippet title()}
          <h3 class="font-serif">Contact Shelter</h3>
        {/snippet}

        {#snippet content()}
          <Button variant="outline" class="w-full">Get in Touch</Button>
        {/snippet}
      </Card>
    </div>
  </div>

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
        {#each [1, 2, 3, 4] as _ (_)}
          <Skeleton class={STYLES.CARD.SIZE} />
        {/each}
      </div>
    {:then items}
      <ItemCarousel
        {items}
        empty={{
          title: "No other animals found",
          description: `There are no other ${ANIMALS.SPECIES.MAP[data.animal.species].label}s at this shelter.`,
        }}
      >
        {#snippet item(animal, i)}
          <AnimalCard
            {animal}
            picture={{
              prioritize: i < 2,
              image: animal.images.at(0),
            }}
          />
        {/snippet}
      </ItemCarousel>
    {:catch error}
      <p class="text-warning" {@attach () => console.error(error)}>
        Error loading related animals
      </p>
    {/await}
  </aside>
</article>
