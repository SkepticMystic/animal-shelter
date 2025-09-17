<script lang="ts">
  import { ANIMALS } from "$lib/const/animal.const";
  import { IMAGES } from "$lib/const/image.const";
  import type { Animal } from "$lib/server/db/schema/animal.model";
  import type { Image } from "$lib/server/db/schema/image.model";
  import { Format } from "$lib/utils/format.util";
  import Picture from "../images/Picture.svelte";
  import AnimalLink from "../links/AnimalLink.svelte";
  import Time from "../Time.svelte";
  import Card from "../ui/card/Card.svelte";
  import Icon from "../ui/icon/Icon.svelte";
  Image;
  let {
    animal,
  }: {
    animal: Animal & { images: Pick<Image, "url" | "thumbhash">[] };
  } = $props();

  const image = animal.images[0];
</script>

<Card class="w-56" description={animal.description}>
  {#snippet title()}
    <div class="flex flex-col gap-3">
      <AnimalLink {animal}>
        <Picture
          {image}
          {...IMAGES.SIZES.THUMBNAIL}
          class="mx-auto"
          alt={animal.name}
          fallback={animal.name[0]}
        />
      </AnimalLink>

      <AnimalLink {animal} class="text-left text-lg" />
    </div>
  {/snippet}

  {#snippet content()}
    <div class="flex items-center justify-between">
      <Time
        date={animal.date_of_birth}
        show={(dt) =>
          Format.date_relative(dt, { suffix: false, numeric: "always" })}
      />

      <div class="flex gap-1">
        <Icon icon={ANIMALS.GENDER.MAP[animal.gender].icon} />
        <Icon icon={ANIMALS.SPECIES.MAP[animal.species].icon} />
      </div>
    </div>
  {/snippet}
</Card>
