<script lang="ts">
  import Anchor from "$lib/components/ui/anchor/Anchor.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import { ICONS } from "$lib/const/icon.const";
  import { ROUTES } from "$lib/const/routes.const";
  import { get_shelter_animals_remote } from "$lib/remote/animal.remote";
  import { get_active_shelter_remote } from "$lib/remote/shelter.remote";

  const shelter = get_active_shelter_remote();
  const animals = get_shelter_animals_remote({});

  $inspect("shelter", shelter.current);
  $inspect("animals", animals.current);
</script>

<article>
  <header class="flex items-center justify-between">
    <h1>Shelter</h1>

    <div>
      <Button href={ROUTES.SHELTER_EDIT} icon={ICONS.EDIT}>Edit Shelter</Button>
    </div>
  </header>

  <p>Dashboard</p>

  <ul>
    <li>
      <Anchor href={ROUTES.SHELTER_ANIMALS}>Animals</Anchor> ({animals.current
        ?.length ?? 0})
    </li>
  </ul>
</article>
