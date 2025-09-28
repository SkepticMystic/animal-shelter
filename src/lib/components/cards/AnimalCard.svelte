<script lang="ts">
  import { resolve } from "$app/paths";
  import { ANIMALS } from "$lib/const/animal.const";
  import { ANIMAL_EVENTS } from "$lib/const/animal_event.const";
  import { ROUTES } from "$lib/const/routes.const";
  import type { Animal } from "$lib/server/db/schema/animal.model";
  import type { Image } from "$lib/server/db/schema/image.model";
  import type { Shelter } from "$lib/server/db/schema/shelter.model";
  import { Format } from "$lib/utils/format.util";
  import AnimalLink from "../links/AnimalLink.svelte";
  import ShelterLink from "../links/ShelterLink.svelte";
  import Time from "../Time.svelte";
  import Card from "../ui/card/Card.svelte";
  import Icon from "../ui/icon/Icon.svelte";

  let {
    animal,
    images,
    shelter,
  }: {
    animal: Animal;
    images: Pick<Image, "url" | "thumbhash">[];
    shelter: Pick<Shelter, "name" | "short_id">;
  } = $props();

  const image = images[0];
</script>

<Card
  description={animal.description}
  picture={{
    image,
    alt: animal.name,
    fallback: animal.name[0],
    href: resolve(ROUTES.ANIMALS_VIEW, animal),
  }}
>
  {#snippet title()}
    <AnimalLink {animal} class="text-lg" />
  {/snippet}

  {#snippet content()}
    <div class="space-y-3">
      <dl>
        <div>
          <dt class="sr-only">Shelter</dt>
          <dd><ShelterLink {shelter} /></dd>
        </div>
      </dl>

      <div class="flex items-center justify-between">
        {#if animal.date_of_birth}
          <Time
            date={animal.date_of_birth}
            show={(dt) =>
              Format.date_distance(dt, { suffix: "old", numeric: "always" })}
          />
        {:else}
          <span class="text-sm text-muted-foreground">Age unknown</span>
        {/if}

        <div class="flex gap-1">
          {#if animal.sterilised}
            <Icon
              title="Sterilised"
              icon={ANIMAL_EVENTS.KINDS.MAP["sterilise"].icon}
            />
          {/if}

          {#if animal.microchip_number}
            <Icon
              title="Microchipped"
              icon={ANIMAL_EVENTS.KINDS.MAP["microchip"].icon}
            />
          {/if}

          <Icon icon={ANIMALS.GENDER.MAP[animal.gender].icon} />
          <Icon icon={ANIMALS.SPECIES.MAP[animal.species].icon} />
        </div>
      </div>
    </div>
  {/snippet}
</Card>
