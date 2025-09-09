<script lang="ts">
  import { resolve } from "$app/paths";
  import { ROUTES } from "$lib/const/routes.const";
  import type { Organization } from "$lib/server/db/schema/auth.model";
  import type { ButtonProps } from "../ui/button/button.svelte";
  import Button from "../ui/button/button.svelte";

  let {
    shelter,
    ...rest
  }: ButtonProps & {
    shelter: Pick<Organization, "slug" | "name">;
  } = $props();
</script>

<Button variant="link" href={resolve(ROUTES.SHELTERS_VIEW, shelter)} {...rest}>
  {shelter.name}
</Button>
