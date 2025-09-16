<script lang="ts">
  import { OrganizationClient } from "$lib/clients/organizations.client.js";
  import { ShelterClient } from "$lib/clients/shelter.client.js";
  import OrganizationMembersList from "$lib/components/auth/members/OrganizationMembersTable.svelte";
  import InviteOrganizationMemberForm from "$lib/components/auth/organizations/InviteOrganizationMemberForm.svelte";
  import OrganizationInvitationsTable from "$lib/components/auth/organizations/OrganizationInvitationsTable.svelte";
  import OrganizationForm from "$lib/components/form/organization/OrganizationForm.svelte";
  import ShelterForm from "$lib/components/form/shelter/ShelterForm.svelte";
  import Picture from "$lib/components/images/Picture.svelte";
  import PictureActionsWrapper from "$lib/components/images/PictureActionsWrapper.svelte";
  import ImageUploader from "$lib/components/images/upload/ImageUploader.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import Collapsible from "$lib/components/ui/collapsible/Collapsible.svelte";
  import Dialog from "$lib/components/ui/dialog/dialog.svelte";
  import Icon from "$lib/components/ui/icon/Icon.svelte";
  import Loading from "$lib/components/ui/loading/Loading.svelte";
  import Separator from "$lib/components/ui/separator/separator.svelte";
  import { ICONS } from "$lib/const/icon.const.js";
  import { IMAGES } from "$lib/const/image.const.js";
  import { get_invitations_remote } from "$lib/remote/auth/invitation.remote.js";
  import { Items } from "$lib/utils/items.util.js";

  let { data } = $props();

  let shelter = $state(data.organization?.shelter);
  let images = $derived(shelter?.images ?? []);
  let members = $state(data.organization?.members ?? []);

  const invitations = get_invitations_remote({});
</script>

<div class="flex flex-col gap-7">
  <div class="space-y-3">
    <div class="flex items-end justify-between">
      <h1>Shelter</h1>

      <Dialog title="New shelter" description="Create a new animal shelter">
        {#snippet trigger()}
          <Icon icon={ICONS.ADD} />
          New shelter
        {/snippet}

        {#snippet content({ close })}
          <OrganizationForm
            form_input={data.create_org_form_input}
            submit={OrganizationClient.create}
            on_success={(_data) => close()}
          />
        {/snippet}
      </Dialog>
    </div>

    {#if shelter}
      <Collapsible>
        {#snippet trigger({ open })}
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <Picture
                {...IMAGES.SIZES.AVATAR}
                image={images.at(0)}
                fallback={shelter!.name.at(0)}
              />

              <h2>{shelter!.name}</h2>
            </div>

            <Button
              variant="ghost"
              icon={open ? "lucide/chevron-down" : "lucide/chevron-left"}
            />
          </div>
        {/snippet}

        {#snippet content()}
          <div class="space-y-5">
            <ShelterForm
              form_input={data.update_shelter_form_input}
              submit={(update) => ShelterClient.update(shelter!.id, update)}
              on_success={(updated) => (shelter = { ...updated, images })}
            />

            <Separator />

            <ImageUploader resource_kind="shelter" resource_id={shelter!.id} />

            <div class="flex flex-wrap gap-3">
              {#each images as image (image.id)}
                <PictureActionsWrapper
                  {image}
                  on_delete={() => (images = Items.remove(images, image.id))}
                >
                  <Picture {image} height={150} width={150} />
                </PictureActionsWrapper>
              {/each}
            </div>
          </div>
        {/snippet}
      </Collapsible>
    {/if}
  </div>

  {#if data.organization}
    <div class="space-y-3">
      <h2>Members</h2>
      <OrganizationMembersList bind:members />
    </div>

    <div class="space-y-3">
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
              on_success={(_invitation) => close()}
            />
          {/snippet}
        </Dialog>
      </div>

      {#if invitations.ready}
        {#if invitations.current.ok}
          <OrganizationInvitationsTable
            invitations={invitations.current.data}
          />
        {/if}
      {:else}
        <Loading loading title="Fetching invitations..." />
      {/if}
    </div>
  {/if}

  {#if data.organization}
    <Separator />

    <!-- NOTE: We delete the org, not the shelter
     Cascade will handle the refs -->
    <Button
      class="w-fit"
      icon={ICONS.DELETE}
      variant="destructive"
      onclick={() => OrganizationClient.delete()}
    >
      Delete shelter
    </Button>
  {/if}
</div>
