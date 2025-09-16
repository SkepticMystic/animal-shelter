<script lang="ts">
  import { resolve } from "$app/paths";
  import type { RouteParams } from "$app/types";
  import { ROUTES } from "$lib/const/routes.const";
  import type { Animal } from "$lib/server/db/schema/animal.model";
  import type { ComponentProps } from "svelte";
  import Anchor from "../ui/anchor/Anchor.svelte";

  let {
    animal,
    children,
    ...rest
  }: ComponentProps<typeof Anchor> & {
    animal: Pick<
      Animal,
      "name" | keyof RouteParams<typeof ROUTES.ANIMALS_VIEW>
    >;
  } = $props();
</script>

<Anchor href={resolve(ROUTES.ANIMALS_VIEW, animal)} {...rest}>
  {#if children}
    {@render children()}
  {:else}
    {animal.name}
  {/if}
</Anchor>
