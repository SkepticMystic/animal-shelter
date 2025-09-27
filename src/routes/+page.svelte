<script lang="ts">
  import { AccessClient } from "$lib/clients/access_control.client";
  import Button from "$lib/components/ui/button/button.svelte";
  import { APP } from "$lib/const/app.js";
  import { ROUTES } from "$lib/const/routes.const";
  import { session } from "$lib/stores/session";
</script>

<article class="mt-32 flex max-w-lg flex-col items-center">
  <header class="text-center">
    <h1>{APP.NAME}</h1>
    <p class="mt-4 text-lg text-muted-foreground">
      {APP.DESCRIPTION}
    </p>
  </header>

  <section class="my-14 flex flex-wrap gap-2">
    <Button href={ROUTES.ANIMALS}>Animals</Button>
    <Button href={ROUTES.SHELTERS} variant="secondary">Shelters</Button>

    {#if $session.data}
      {#if $session.data.session.activeOrganizationId}
        <Button href={ROUTES.AUTH_ORGANIZATION} variant="outline">Team</Button>
      {:else if AccessClient.user_can({ organization: ["create"] })}
        <Button href={ROUTES.AUTH_ORGANIZATION_CREATE} variant="outline">
          Create Team
        </Button>
      {/if}
    {/if}
  </section>
</article>
