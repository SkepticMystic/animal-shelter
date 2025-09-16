import { BetterAuthClient } from "$lib/auth-client";
import type { AuthSchema } from "$lib/schema/auth.schema";
import { BetterAuth } from "$lib/utils/better-auth.util";
import type z from "zod";
import { Client } from "./index.client";
import { OrganizationClient } from "./organizations.client";

export const InvitationClient = {
  create: async (input: z.infer<typeof AuthSchema.Org.member_invite_form>) =>
    Client.better_auth(
      () => BetterAuthClient.organization.inviteMember(input),
      { toast: { success: "Invitation sent" } },
    ),

  accept: (invitationId: string) =>
    Client.request(
      async () => {
        const accept_res = await BetterAuth.to_result(
          BetterAuthClient.organization.acceptInvitation({ invitationId }),
        );
        if (!accept_res.ok) return accept_res;

        const set_active_res = await OrganizationClient.set_active(
          accept_res.data.invitation.organizationId,
        );
        if (!set_active_res.ok) return set_active_res;

        return accept_res;
      },
      { toast: { success: "Invitation accepted" } },
    ),

  cancel: (invitationId: string) =>
    Client.better_auth(
      () => BetterAuthClient.organization.cancelInvitation({ invitationId }),
      {
        confirm: "Are you sure you want to cancel this invitation?",
        toast: { success: "Invitation cancelled" },
      },
    ),
};
