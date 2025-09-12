<script lang="ts">
  import { OrganizationsClient } from "$lib/clients/organizations.client.js";
  import OrganizationMembersList from "$lib/components/auth/members/OrganizationMembersTable.svelte";
  import InviteOrganizationMemberForm from "$lib/components/auth/organizations/InviteOrganizationMemberForm.svelte";
  import OrganizationInvitationsTable from "$lib/components/auth/organizations/OrganizationInvitationsTable.svelte";
  import DeleteImageButton from "$lib/components/buttons/DeleteImageButton.svelte";
  import OrganizationForm from "$lib/components/form/organization/OrganizationForm.svelte";
  import Picture from "$lib/components/images/Picture.svelte";
  import ImageUploader from "$lib/components/images/upload/ImageUploader.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import Collapsible from "$lib/components/ui/collapsible/Collapsible.svelte";
  import Dialog from "$lib/components/ui/dialog/dialog.svelte";
  import Icon from "$lib/components/ui/icon/Icon.svelte";
  import Loading from "$lib/components/ui/loading/Loading.svelte";
  import Separator from "$lib/components/ui/separator/separator.svelte";
  import { IMAGES } from "$lib/const/image.const";
  import { get_invitations_remote } from "$lib/remote/auth/invitation.remote.js";
  import { Items } from "$lib/utils/items.util.js";

  let { data } = $props();

  let images = $state(data.organization?.images ?? []);
  let members = $state(data.organization?.members ?? []);
  const invitations = get_invitations_remote({});
</script>

<div class="flex flex-col gap-7">
  <div class="space-y-3">
    <div class="flex items-end justify-between">
      <div class="flex items-center gap-2">
        {#if data.organization}
          <Picture {...IMAGES.SIZES.AVATAR} image={images?.at(0)} />
        {/if}

        <h1>{data.organization?.name ?? "Shelter"}</h1>
      </div>

      <Dialog title="New Shelter" description="Create a new animal shelter">
        {#snippet trigger()}
          <Icon icon="lucide/plus" />
          New Shelter
        {/snippet}

        {#snippet content({ close })}
          <OrganizationForm
            form_input={data.create_org_form_input}
            submit={OrganizationsClient.create}
            on_success={(_data) => close()}
          />
        {/snippet}
      </Dialog>
    </div>

    {#if data.organization}
      <Collapsible>
        {#snippet trigger({ open })}
          <div class="flex items-center justify-between">
            <h2>Edit shelter</h2>

            <Button
              variant="ghost"
              icon={open ? "lucide/chevron-down" : "lucide/chevron-left"}
            />
          </div>
        {/snippet}

        {#snippet content()}
          <div class="space-y-5">
            <OrganizationForm
              form_input={data.update_org_form_input}
              submit={(update) =>
                OrganizationsClient.update(data.organization!.id, update)}
            />

            <Separator />

            <ImageUploader
              resource_kind="organization"
              resource_id={data.organization!.id}
            />

            <div class="flex flex-wrap gap-3">
              {#each images as image (image.id)}
                <div class="flex flex-col gap-2">
                  <Picture {image} height={150} width={150} />
                  <DeleteImageButton
                    image_id={image.id}
                    on_delete={() => {
                      images = Items.remove(images, image.id);
                    }}
                  />
                </div>
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
</div>
