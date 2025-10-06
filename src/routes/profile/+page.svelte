<script lang="ts">
  import { goto } from "$app/navigation";
  import { UserClient } from "$lib/clients/user.client";
  import ChangePasswordForm from "$lib/components/auth/accounts/ChangePasswordForm.svelte";
  import UserAccountsList from "$lib/components/auth/accounts/UserAccountsList.svelte";
  import AddPasskeyButton from "$lib/components/auth/passkeys/AddPasskeyButton.svelte";
  import UserPasskeysList from "$lib/components/auth/passkeys/UserPasskeysList.svelte";
  import UserAvatar from "$lib/components/ui/avatar/UserAvatar.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import Dialog from "$lib/components/ui/dialog/dialog.svelte";
  import Item from "$lib/components/ui/item/Item.svelte";
  import Separator from "$lib/components/ui/separator/separator.svelte";
  import { ROUTES } from "$lib/const/routes.const";
  import { TOAST } from "$lib/const/toast.const";
  import { App } from "$lib/utils/app";

  let { data } = $props();
  let { passkeys, accounts } = $state(data);

  const delete_user = async () => {
    const res = await UserClient.delete();
    if (res.ok) {
      await goto(
        App.url(ROUTES.AUTH_SIGNIN, { toast: TOAST.IDS.USER_DELETED }),
      );
    }
  };
</script>

<article>
  <header>
    <h1>Profile</h1>
  </header>

  <section class="flex items-center gap-3">
    <Item title={data.user.name} description={data.user.email}>
      {#snippet media()}
        <UserAvatar class="size-16" user={data.user} />
      {/snippet}
    </Item>
  </section>

  <section>
    <div class="flex items-center gap-3">
      <h2>Passkeys</h2>
      <!-- NOTE: Not even invalidateAll seems to get the new key loaded... -->
      <AddPasskeyButton
        on_added={() => {
          location.href = App.url(ROUTES.PROFILE, {
            toast: TOAST.IDS.PASSKEY_ADDED,
          });
        }}
      />
    </div>

    <UserPasskeysList bind:passkeys />
  </section>

  <Separator />

  <section>
    <h2>Accounts</h2>
    <UserAccountsList bind:accounts />
  </section>

  <Separator />

  <section class="">
    {#if accounts.find((acc) => acc.providerId === "credential")}
      <Item
        variant="outline"
        title="Change Password"
        description="Change your account password"
      >
        {#snippet actions()}
          <Dialog
            icon="lucide/lock"
            title="Change Password"
            description="Change your account password"
          >
            {#snippet content({ close })}
              <ChangePasswordForm on_success={() => close()} />
            {/snippet}
          </Dialog>
        {/snippet}
      </Item>
    {/if}

    <Item
      variant="outline"
      title="Delete Account"
      description="Permanently delete your account"
      class="border-destructive/50 bg-destructive/5"
    >
      {#snippet actions()}
        <Button
          variant="destructive"
          onclick={delete_user}
          icon="lucide/trash"
        />
      {/snippet}
    </Item>
  </section>
</article>
