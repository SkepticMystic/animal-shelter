<script lang="ts">
  import { ANIMALS } from "$lib/const/animal.const";
  import { TIME } from "$lib/const/time";
  import type { Animal } from "$lib/server/db/schema/animal.model";
  import type { Image } from "$lib/server/db/schema/image.model";
  import Picture from "../images/Picture.svelte";
  import Avatar from "../ui/avatar/avatar.svelte";
  import Card from "../ui/card/Card.svelte";
  Image;
  let {
    animal,
  }: {
    animal: Animal & { images: Pick<Image, "url" | "blurhash">[] };
  } = $props();

  const image = animal.images[0];
</script>

<Card>
  {#snippet title()}
    <div class="flex items-center justify-between">
      <h3>{animal.name}</h3>

      {#if image}
        <Avatar>
          {#snippet img(props)}
            <Picture
              {image}
              width={32}
              height={32}
              alt={animal.name}
              {...props}
            />
          {/snippet}
        </Avatar>
      {/if}
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
