<script lang="ts">
  import { resolve } from "$app/paths";
  import type { RouteParams } from "$app/types";
  import { ROUTES } from "$lib/const/routes.const";
  import type { Animal } from "$lib/server/db/schema/animal.model";
  import type { ButtonProps } from "../ui/button/button.svelte";
  import Button from "../ui/button/button.svelte";

  let {
    animal,
    ...rest
  }: ButtonProps & {
    animal: Pick<
      Animal,
      "name" | keyof RouteParams<typeof ROUTES.ANIMALS_VIEW>
    >;
  } = $props();
</script>

<Button href={resolve(ROUTES.ANIMALS_VIEW, animal)} variant="link" {...rest}>
  {animal.name}
</Button>
