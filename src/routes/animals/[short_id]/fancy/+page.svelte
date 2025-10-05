<script lang="ts">
  import Picture from "$lib/components/images/Picture.svelte";
  import ShelterLink from "$lib/components/links/ShelterLink.svelte";
  import PrerenderedMarkdown from "$lib/components/text/PrerenderedMarkdown.svelte";
  import Badge from "$lib/components/ui/badge/badge.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import Card from "$lib/components/ui/card/Card.svelte";
  import Icon from "$lib/components/ui/icon/Icon.svelte";
  import Iconed from "$lib/components/ui/icon/Iconed.svelte";
  import { ANIMALS } from "$lib/const/animal.const.js";
  import type { Image } from "$lib/server/db/schema/image.model.js";
  import { Format } from "$lib/utils/format.util";

  let { data } = $props();
  const animal = data.animal;

  const [banner_image, ...other_images] = animal.images as [
    Image | undefined,
    ...Image[],
  ];
</script>

<article class="min-h-screen">
  <div class="relative h-[500px] w-full overflow-hidden">
    <Picture prioritize alt={animal.name} image={banner_image} />

    <div
      class="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent"
    ></div>

    <div class="absolute right-0 bottom-0 left-0 p-8">
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

        <Badge {...ANIMALS.STATUS.MAP[animal.status]} class="px-4 py-2 text-lg"
        ></Badge>
      </header>
    </div>
  </div>

  <div class="grid gap-8 py-6 md:py-12 lg:grid-cols-3">
    <div class="space-y-8 lg:col-span-2">
      {#if data.prerendered.description}
        <section>
          <h2 class="font-serif">
            About {animal.name}
          </h2>

          <PrerenderedMarkdown html={data.prerendered.description} />
        </section>
      {/if}

      <section>
        <h3 class="font-serif">Traits</h3>

        <div class="flex flex-wrap gap-2">
          {#each animal.traits as trait (trait)}
            <Badge
              variant="secondary"
              class="px-4 py-2 text-base"
              {...ANIMALS.TRAITS.MAP[trait]}
            ></Badge>
          {/each}
        </div>
      </section>

      <!-- {#if other_images.length}
        <section>
          <h3 class="font-serif">More Photos</h3>

          <ItemCarousel items={other_images}>
            {#snippet item(image, i)}
              <Picture {image} {...IMAGES.SIZES.PREVIEW} prioritize={i < 2} />
            {/snippet}
          </ItemCarousel>
        </section>
      {/if} -->

      <!-- {#if data.animal.shelter.place}
        <section>
          <h2 class="font-serif">Shelter</h2>

          <GoogleMap place={data.animal.shelter.place} />
        </section>
      {/if} -->
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
            <div class="space-y-2">
              <div class="flex items-center gap-3">
                <Icon icon="lucide/calendar" class="h-5 w-5 text-primary" />

                <div>
                  <p class="text-sm text-muted-foreground">Age</p>
                  <p class="font-medium text-card-foreground">
                    {Format.date_distance(animal.date_of_birth, {
                      suffix: "old",
                      numeric: "always",
                    })}
                  </p>
                </div>
              </div>

              <div class="flex items-center gap-3">
                <Icon icon="lucide/ruler" class="h-5 w-5 text-primary" />

                <div>
                  <p class="text-sm text-muted-foreground">Species</p>
                  <p class="font-medium text-card-foreground">
                    {ANIMALS.SPECIES.MAP[animal.species].label}
                  </p>
                </div>
              </div>

              <div class="flex items-center gap-3">
                <Icon icon="lucide/stethoscope" class="h-5 w-5 text-primary" />

                <div>
                  <p class="text-sm text-muted-foreground">Sterilised</p>
                  <p class="font-medium text-card-foreground">
                    {animal.sterilised ? "Yes" : "No"}
                  </p>
                </div>
              </div>

              <div class="flex items-center gap-3">
                <Icon icon="lucide/home" class="h-5 w-5 text-primary" />

                <div>
                  <p class="text-sm text-muted-foreground">Shelter</p>
                  <ShelterLink shelter={animal.shelter} />
                </div>
              </div>

              <div class="flex items-center gap-3">
                <Icon icon="lucide/map-pin" class="h-5 w-5 text-primary" />

                <div>
                  <p class="text-sm text-muted-foreground">Intake Date</p>
                  <p class="font-medium text-card-foreground">
                    {Format.date(animal.intake_date)}
                  </p>
                </div>
              </div>
            </div>
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
</article>
