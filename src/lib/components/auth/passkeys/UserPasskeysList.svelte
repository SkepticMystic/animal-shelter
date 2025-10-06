<script lang="ts">
  import type { auth } from "$lib/auth";
  import { PasskeysClient } from "$lib/clients/passkeys.client";
  import Time from "$lib/components/Time.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import Dialog from "$lib/components/ui/dialog/dialog.svelte";
  import Icon from "$lib/components/ui/icon/Icon.svelte";
  import Item from "$lib/components/ui/item/Item.svelte";
  import ItemList from "$lib/components/ui/item/ItemList.svelte";
  import { Items } from "$lib/utils/items.util";
  import EditPasskeyForm from "./EditPasskeyForm.svelte";

  let {
    passkeys = $bindable(),
  }: {
    passkeys: Awaited<ReturnType<typeof auth.api.listPasskeys>>;
  } = $props();

  const delete_passkey = async (passkey_id: string) => {
    const res = await PasskeysClient.delete(passkey_id);
    if (res.ok) {
      passkeys = Items.remove(passkeys, passkey_id);
    }
  };

  let items = $derived(passkeys);
</script>

<ItemList
  {items}
  empty={{
    title: "No Passkeys",
    description: "You have no registered passkeys.",
  }}
>
  {#snippet item(passkey)}
    <Item
      size="sm"
      icon="lucide/fingerprint"
      title={passkey.name || "Unnamed Passkey"}
    >
      {#snippet description()}
        <p class="text-sm text-muted-foreground">
          Connected on <Time date={passkey.createdAt} show="datetime" />
        </p>
      {/snippet}

      {#snippet actions()}
        <Dialog
          size="icon"
          title="Edit Passkey"
          description="Update your passkey"
        >
          {#snippet trigger()}
            <Icon icon="lucide/pencil" />
          {/snippet}

          {#snippet content()}
            <EditPasskeyForm
              {passkey}
              on_success={(updated) => {
                passkeys = Items.patch(passkeys, passkey.id, updated.passkey);
              }}
            />
          {/snippet}
        </Dialog>

        <Button
          icon="lucide/x"
          variant="destructive"
          title="Delete Passkey"
          onclick={() => delete_passkey(passkey.id)}
        />
      {/snippet}
    </Item>
  {/snippet}
</ItemList>
