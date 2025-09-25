<script lang="ts">
  import { OrganizationClient } from "$lib/clients/organizations.client.js";
  import OrganizationMembersList from "$lib/components/auth/members/OrganizationMembersTable.svelte";
  import InviteOrganizationMemberForm from "$lib/components/auth/organizations/InviteOrganizationMemberForm.svelte";
  import OrganizationInvitationsTable from "$lib/components/auth/organizations/OrganizationInvitationsTable.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import Dialog from "$lib/components/ui/dialog/dialog.svelte";
  import Icon from "$lib/components/ui/icon/Icon.svelte";
  import Loading from "$lib/components/ui/loading/Loading.svelte";
  import Separator from "$lib/components/ui/separator/separator.svelte";
  import { ICONS } from "$lib/const/icon.const.js";
  import { get_invitations_remote } from "$lib/remote/auth/invitation.remote.js";

  let { data } = $props();

  let members = $state(data.organization?.members ?? []);

  const invitations = get_invitations_remote({});
</script>

<article>
  <header class="flex items-end justify-between">
    <h1>Team</h1>
  </header>

  <section>
    <h2>Members</h2>
    <OrganizationMembersList bind:members />
  </section>

  <section>
    <div class="flex items-center justify-between">
      <h2>Invites</h2>

      <Dialog
        variant="outline"
        title="Invite Member"
        description="Invite a new member to your organization"
      >
        {#snippet trigger()}
          <Icon icon="lucide/user-plus" /> Invite Member
        {/snippet}

        {#snippet content({ close })}
          <InviteOrganizationMemberForm
            form_input={data.member_invite_form_input}
            on_success={(_) => {
              invitations.refresh();
              close();
            }}
          />
        {/snippet}
      </Dialog>
    </div>

    {#if invitations.ready}
      {#if invitations.current.ok}
        <OrganizationInvitationsTable invitations={invitations.current.data} />
      {/if}
    {:else}
      <Loading loading title="Fetching invitations..." />
    {/if}
  </section>

  <Separator />

  <!-- NOTE: We delete the org, not the shelter
     Cascade will handle the refs -->
  <section>
    <Button
      class="w-fit"
      icon={ICONS.DELETE}
      variant="destructive"
      onclick={() => OrganizationClient.delete()}
    >
      Delete shelter
    </Button>
  </section>
</article>
