import { BetterAuthClient } from "$lib/auth-client";
import type { OrganizationSchema } from "$lib/server/db/schema/auth.model";
import { session } from "$lib/stores/session";
import { BetterAuth } from "$lib/utils/better-auth.util";
import { err } from "$lib/utils/result.util";
import { Strings } from "$lib/utils/strings.util";
import { Effect, pipe } from "effect";
import { get } from "svelte/store";
import { Client } from "./index.client";

const set_active_inner = (organizationId: string | undefined) =>
  Effect.runPromise(
    pipe(
      Effect.sync(() =>
        organizationId
          ? Effect.succeed(organizationId)
          : Effect.fail({ message: "No organization ID provided." }),
      ),

      Effect.flatMap((e) => e),
      Effect.andThen((organizationId) =>
        BetterAuthClient.organization.setActive({ organizationId }),
      ),
      Effect.andThen((r) => BetterAuth.to_result(r)),
      Effect.tap((r) => r.ok && location.reload()),
    ),
  );

const check_slug_inner = async (slug: string) => {
  const res = await BetterAuth.to_result(
    BetterAuthClient.organization.checkSlug({ slug }),
  );

  if (!res.ok) {
    return res;
  } else if (!res.data.status) {
    return err({ message: "Organization slug is already taken." });
  } else {
    return res;
  }
};

export const OrganizationClient = {
  set_active: (organizationId: string | undefined) =>
    Client.request(() => set_active_inner(organizationId), {
      toast: { success: "Active organization updated." },
    }),

  check_slug: (slug: string) =>
    Client.request(() => check_slug_inner(slug), {
      toast: { success: "Organization slug is available." },
    }),

  create: (input: OrganizationSchema.Insert) =>
    Client.request(
      async () => {
        const slug = Strings.slugify(input.name);
        const slug_res = await check_slug_inner(slug);
        if (!slug_res.ok) return slug_res;

        const create_res = await BetterAuth.to_result(
          BetterAuthClient.organization.create({
            ...input,
            slug,
            keepCurrentActiveOrganization: false,
            logo: input.logo === null ? undefined : input.logo,
          }),
        );
        if (!create_res.ok) return create_res;

        // TODO: set_active does a full .reload()
        // Which makes the superForm shout about leaving when tainted
        // So try find a better way
        // BUT, I tried $store.notify and invalidateAll, but neither fully worked
        // const set_active_res = await set_active_inner(create_res.data.id);
        // if (!set_active_res.ok) return set_active_res;
        await BetterAuthClient.organization.setActive({
          organizationId: create_res.data.id,
        });

        return create_res;
      },
      { toast: { success: "Organization created" } },
    ),

  update: (organizationId: string, update: OrganizationSchema.Update) =>
    Client.better_auth(
      () =>
        // NOTE: Don't check or update slug, there's missions
        // - we need to check if the name is changing
        // - then check the new slug
        BetterAuthClient.organization.update({
          organizationId,
          data: {
            ...update,
            logo: update.logo === null ? undefined : update.logo,
          },
        }),
      { toast: { success: "Organization updated" } },
    ),

  delete: (organizationId?: string | null) =>
    Client.request(
      async () => {
        organizationId ??= get(session)?.data?.session.activeOrganizationId;

        if (!organizationId) {
          return err({ message: "No organization ID provided." });
        }

        const res = await BetterAuth.to_result(
          BetterAuthClient.organization.delete({ organizationId }),
        );

        if (res.ok) {
          // TODO: Improve this
          location.reload();
        }

        return res;
      },
      {
        confirm: "Are you sure you want to delete this organization?",
        toast: { success: "Organization deleted" },
      },
    ),
};
