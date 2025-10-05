<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import Alert from "$lib/components/ui/alert/Alert.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import Iconed from "$lib/components/ui/icon/Iconed.svelte";
  import { ROUTES } from "$lib/const/routes.const";

  function goBack() {
    window.history.back();
  }

  function goHome() {
    goto(ROUTES.HOME);
  }
</script>

<div class="flex h-svh items-center justify-center">
  {#if page?.error}
    <div class="flex flex-col gap-2">
      <Alert variant="destructive" class="border-destructive/50">
        {#snippet title()}
          <Iconed icon="lucide/message-circle-warning">
            {page.status}
          </Iconed>
        {/snippet}

        {#snippet description()}
          <p>{page.error!.message || "Something went wrong"}</p>
        {/snippet}
      </Alert>

      <section class="flex w-full flex-row gap-2">
        <Button class="grow" variant="outline" onclick={goHome}>Go Home</Button>
        <Button class="grow" variant="outline" onclick={goBack}>Go Back</Button>
      </section>
    </div>
  {/if}
</div>
