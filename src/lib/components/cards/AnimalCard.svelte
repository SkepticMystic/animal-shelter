<script lang="ts">
  import { resolve } from "$app/paths";
  import { ANIMALS } from "$lib/const/animal.const";
  import { ANIMAL_EVENTS } from "$lib/const/animal_event.const";
  import { ROUTES } from "$lib/const/routes.const";
  import { STYLES } from "$lib/const/styles.const";
  import type { Animal } from "$lib/server/db/schema/animal.model";
  import type { Shelter } from "$lib/server/db/schema/shelter.model";
  import { Format } from "$lib/utils/format.util";
  import type { ComponentProps } from "svelte";
  import Picture from "../images/Picture.svelte";
  import AnimalLink from "../links/AnimalLink.svelte";
  import ShelterLink from "../links/ShelterLink.svelte";
  import Time from "../Time.svelte";
  import Badge from "../ui/badge/badge.svelte";
  import Card from "../ui/card/Card.svelte";
  import Icon from "../ui/icon/Icon.svelte";

  let {
    animal,
    picture,
    shelter,
  }: {
    animal: Animal;
    picture?: ComponentProps<typeof Picture>;
    shelter?: Pick<Shelter, "name" | "short_id">;
  } = $props();
</script>

<Card
  class={STYLES.CARD.SIZE}
  description={animal.description}
  picture={{
    alt: animal.name,
    fallback: animal.name[0],
    href: resolve(ROUTES.ANIMALS_VIEW, animal),
    ...picture,
  }}
>
  {#snippet title()}
    <div class="flex items-center justify-between">
      <div class="flex flex-col">
        <AnimalLink {animal} class="text-lg" />
        <span class="text-sm font-light text-muted-foreground italic">
          {animal.breed ?? "-"}
        </span>
      </div>

      <Badge variant={ANIMALS.STATUS.MAP[animal.status].variant}>
        {ANIMALS.STATUS.MAP[animal.status].label}
      </Badge>
    </div>
  {/snippet}

  {#snippet content()}
    <div class="space-y-3">
      <dl>
        {#if shelter}
          <div>
            <dt class="sr-only">Shelter</dt>
            <dd>
              <ShelterLink {shelter} />
            </dd>
          </div>
        {/if}
      </dl>

      <div class="flex items-center justify-between">
        <Time
          class="text-sm text-muted-foreground"
          date={animal.date_of_birth}
          show={(dt) =>
            dt
              ? Format.date_distance(dt, { suffix: "old", numeric: "always" })
              : "Age unknown"}
        />

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
