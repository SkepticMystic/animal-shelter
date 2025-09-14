<script lang="ts">
  import { resolve } from "$app/paths";
  import { ANIMALS } from "$lib/const/animal.const";
  import { IMAGES } from "$lib/const/image.const";
  import { ROUTES } from "$lib/const/routes.const";
  import { TIME } from "$lib/const/time";
  import type { Animal } from "$lib/server/db/schema/animal.model";
  import type { Image } from "$lib/server/db/schema/image.model";
  import Picture from "../images/Picture.svelte";
  import Button from "../ui/button/button.svelte";
  import Card from "../ui/card/Card.svelte";
  Image;
  let {
    animal,
  }: {
    animal: Animal & { images: Pick<Image, "url" | "thumbhash">[] };
  } = $props();

  const image = animal.images[0];
</script>

<Card>
  {#snippet title()}
    <div class="flex items-center justify-between">
      <Button variant="link" href={resolve(ROUTES.ANIMALS_VIEW, animal)}>
        {animal.name}
      </Button>

      <Picture
        {image}
        {...IMAGES.SIZES.AVATAR}
        alt={animal.name}
        fallback={animal.name[0]}
      />
    </div>
  {/snippet}

  {#snippet content()}
    <ul>
      <li>
        <span class="font-semibold">Species</span>: {ANIMALS.SPECIES.MAP[
          animal.species
        ].label}
      </li>

      <li>
        <span class="font-semibold">Age</span>: {animal.date_of_birth
          ? Math.floor(
              (Date.now() - new Date(animal.date_of_birth).getTime()) /
                TIME.YEAR,
            ) + " years"
          : "Unknown"}
      </li>

      <li>
        <span class="font-semibold">Description</span>: {animal.bio}
      </li>
    </ul>
  {/snippet}
</Card>
