<script lang="ts">
  import { resolve } from "$app/paths";
  import BackButton from "$lib/components/buttons/BackButton.svelte";
  import Picture from "$lib/components/images/Picture.svelte";
  import AnimalLink from "$lib/components/links/AnimalLink.svelte";
  import UserAvatar from "$lib/components/ui/avatar/UserAvatar.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import ItemCarousel from "$lib/components/ui/carousel/ItemCarousel.svelte";
  import Labeled from "$lib/components/ui/label/Labeled.svelte";
  import { ICONS } from "$lib/const/icon.const.js";
  import { IMAGES } from "$lib/const/image.const.js";
  import { ROUTES } from "$lib/const/routes.const.js";

  let { data } = $props();
</script>

<article>
  <header class="flex items-center justify-between">
    <div class="flex items-center gap-2">
      <BackButton />
      <h1>Animal event</h1>
    </div>

    <div class="flex items-center gap-2">
      <Button
        variant="outline"
        icon={ICONS.EDIT}
        title="Edit event"
        href={resolve(ROUTES.SHELTER_ANIMAL_EVENTS_EDIT, data.animal_event)}
      />
    </div>
  </header>

  <section class="flex flex-wrap items-center gap-3">
    <Labeled label="Animal">
      <AnimalLink animal={data.animal_event.animal} class="w-fit" />
    </Labeled>

    {#if data.animal_event.administrator?.user}
      <Labeled label="Administrator">
        <UserAvatar user={data.animal_event.administrator.user} />
      </Labeled>
    {/if}
  </section>

  {#if data.animal_event.images.length}
    <section>
      <ItemCarousel items={data.animal_event.images}>
        {#snippet item(image, i)}
          <Picture {image} {...IMAGES.SIZES.THUMBNAIL} prioritize={i < 2} />
        {/snippet}
      </ItemCarousel>
    </section>
  {/if}

  <pre>{JSON.stringify(data.animal_event, null, 2)}</pre>
</article>
