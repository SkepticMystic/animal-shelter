<script lang="ts">
  import { page } from "$app/state";
  import type { ResolvedPathname } from "$app/types";
  import { InvitationClient } from "$lib/clients/invitation.client.js";
  import Button from "$lib/components/ui/button/button.svelte";
  import { ROUTES } from "$lib/const/routes.const.js";
  import { TOAST } from "$lib/const/toast.const.js";
  import { App } from "$lib/utils/app.js";

  let { data } = $props();

  const redirect_uri = (page.url.pathname +
    page.url.search) as ResolvedPathname;

  const accept_invite = async () => {
    if (!data.invitation) return;

    const res = await InvitationClient.accept(data.invitation.id);
    if (res.ok) {
      // goto doesn't update the session...
      location.href = App.url(ROUTES.AUTH_DIRECT_USER, {
        toast: TOAST.IDS.ORG_INVITE_ACCEPTED,
      });
    }
  };

  const reject_invite = async () => {
    if (!data.invitation) return;

    await InvitationClient.reject(data.invitation.id);
  };
</script>

<article>
  <header>
    <h2>Accept Invitation</h2>
  </header>

  <section>
    {#if data.prompt === "accept_invite"}
      <p>
        You've been invited by <strong>
          {data.inviter.name ?? data.inviter.email}
        </strong>
        to join the org:
        <strong>{data.organization.name}</strong>.
      </p>
      <Button onclick={accept_invite} icon="lucide/check-circle">
        Accept Invite
      </Button>
      <Button
        variant="destructive"
        icon="lucide/x-circle"
        onclick={reject_invite}
      >
        Reject Invite
      </Button>
    {:else if data.prompt === "signup_login"}
      <p>Please login or signup to accept the invitation.</p>
      <div class="flex gap-2">
        <Button href={App.url(ROUTES.AUTH_SIGNIN, { redirect_uri })}>
          Login
        </Button>
        <Button href={App.url(ROUTES.AUTH_SIGNUP, { redirect_uri })}>
          Signup
        </Button>
      </div>
    {:else if data.prompt === "wrong_account"}
      <p>
        You are logged in with the wrong account. Please login or signup with
        the same email address that the invitation was sent to:
      </p>
      <div class="flex gap-2">
        <Button href={App.url(ROUTES.AUTH_SIGNIN, { redirect_uri })}>
          Login
        </Button>
        <Button href={App.url(ROUTES.AUTH_SIGNUP, { redirect_uri })}>
          Signup
        </Button>
      </div>
    {:else if data.prompt === "already_member"}
      <p class="">You are already a member of the organization.</p>
      <Button href={ROUTES.AUTH_ORGANIZATION}>View Organization</Button>
    {:else if data.prompt === "invite_not_pending"}
      <p class="text-error">
        The invitation is no longer pending. Please contact the inviter for more
        details.
      </p>
    {:else if data.prompt === "invite_expired"}
      <p class="text-error">
        The invitation has expired. Please contact the inviter for a new
        invitation.
      </p>
    {:else if data.prompt === "invalid_invite_id"}
      <p class="text-error">
        The invitation link is invalid. Please check the link or contact the
        inviter.
      </p>
    {:else}
      <p class="text-error">Invalid prompt type.</p>
    {/if}
  </section>
</article>
