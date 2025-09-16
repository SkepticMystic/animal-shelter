<script lang="ts">
  import { resolve } from "$app/paths";
  import type { RouteParams } from "$app/types";
  import { ROUTES } from "$lib/const/routes.const";
  import type { Shelter } from "$lib/server/db/schema/shelter.model";
  import type { ComponentProps } from "svelte";
  import Anchor from "../ui/anchor/Anchor.svelte";

  let {
    shelter,
    ...rest
  }: ComponentProps<typeof Anchor> & {
    shelter: Pick<
      Shelter,
      "name" | keyof RouteParams<typeof ROUTES.SHELTERS_VIEW>
    >;
  } = $props();
</script>

<Anchor href={resolve(ROUTES.SHELTERS_VIEW, shelter)} {...rest}>
  {shelter.name}
</Anchor>
