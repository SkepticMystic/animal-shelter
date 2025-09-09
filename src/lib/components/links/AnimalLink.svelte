<script lang="ts">
  import { resolve } from "$app/paths";
  import { ROUTES } from "$lib/const/routes.const";
  import type { Animal } from "$lib/server/db/schema/animal.model";
  import type { ButtonProps } from "../ui/button/button.svelte";
  import Button from "../ui/button/button.svelte";

  let {
    animal,
    ...rest
  }: ButtonProps & {
    animal: Pick<Animal, "short_id" | "name">;
  } = $props();
</script>

<Button href={resolve(ROUTES.ANIMALS_VIEW, animal)} variant="link" {...rest}>
  {animal.name}
</Button>
