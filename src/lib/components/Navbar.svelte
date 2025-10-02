<script lang="ts">
  import { dev } from "$app/environment";
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import { BetterAuthClient } from "$lib/auth-client";
  import { AdminClient } from "$lib/clients/admin.client";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
  import { ROUTES } from "$lib/const/routes.const";
  import { TOAST } from "$lib/const/toast.const";
  import { session, user } from "$lib/stores/session";
  import { App } from "$lib/utils/app";
  import type { ClassValue } from "svelte/elements";
  import ThemeSelector from "./ThemeSelector.svelte";
  import OrganizationSelector from "./auth/organizations/OrganizationSelector.svelte";
  import AppLogo from "./images/AppLogo.svelte";
  import Button from "./ui/button/button.svelte";
  import Icon from "./ui/icon/Icon.svelte";

  interface Route {
    side: "center" | "right";
    label: string;
    href: string;
    icon: ClassValue;
    /** Only show if user is authenticated */
    authed: boolean;
    /** Only show if user is a member of an organization */
    member?: boolean;
    admin?: boolean;
  }

  const routes: Route[] = [
    {
      side: "right",
      label: "Home",
      href: ROUTES.AUTH_DIRECT_USER,
      icon: "lucide/home",
      authed: true,
    },
    {
      side: "right",
      label: "Team",
      href: ROUTES.AUTH_ORGANIZATION,
      icon: "lucide/users",
      authed: true,
      member: true,
    },
    {
      side: "right",
      label: "Profile",
      href: ROUTES.PROFILE,
      icon: "lucide/user",
      authed: true,
    },
    {
      side: "right",
      label: "Admin",
      href: ROUTES.ADMIN,
      icon: "lucide/shield-check",
      authed: true,
      admin: true,
    },
    {
      side: "right",
      label: "Sign in",
      href: ROUTES.AUTH_SIGNIN,
      icon: "lucide/log-in",
      authed: false,
    },
    {
      side: "right",
      label: "Sign up",
      href: ROUTES.AUTH_SIGNUP,
      icon: "lucide/user-plus",
      authed: false,
    },
  ];

  const show_route = (route: Route, side?: Route["side"]) => {
    if (side && route.side !== side) {
      return false;
    } else if (route.authed !== !!$user) {
      return false;
    } else if (route.member && !$session.data?.session.activeOrganizationId) {
      return false;
    } else if (route.admin && $user?.role !== "admin") {
      return false;
    }

    return true;
  };

  const signout = () =>
    BetterAuthClient.signOut({
      fetchOptions: {
        onSuccess: () =>
          goto(App.url(ROUTES.AUTH_SIGNIN, { toast: TOAST.IDS.SIGNED_OUT })),
        onError: (error) => {
          console.error("Error signing out:", error);
          location.reload();
        },
      },
    });
</script>

<nav
  class="bg-base-100 mx-auto flex h-16 max-w-4xl items-center justify-between px-3"
>
  <div>
    <Button href={ROUTES.HOME} size="icon" variant="ghost">
      <AppLogo />
    </Button>
  </div>

  {#if dev}
    <div class="truncate">
      <span class="font-mono">{page.url.pathname}</span>
    </div>
  {/if}

  <div class="flex gap-1">
    <OrganizationSelector />

    <ThemeSelector />

    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        {#snippet child({ props })}
          <Button {...props} variant="outline" icon="lucide/menu"></Button>
        {/snippet}
      </DropdownMenu.Trigger>

      <DropdownMenu.Content align="end">
        {#each routes as r (r.href)}
          {#if show_route(r)}
            <DropdownMenu.Item onSelect={() => goto(r.href)}>
              <Icon icon={r.icon} />
              {r.label}
            </DropdownMenu.Item>
          {/if}
        {/each}

        {#if $user}
          <DropdownMenu.Item onSelect={signout}>
            <Icon icon="lucide/log-out" />
            Sign out
          </DropdownMenu.Item>
        {/if}

        {#if $session.data?.session.impersonatedBy}
          <DropdownMenu.Item onSelect={() => AdminClient.stop_impersonating()}>
            <Icon icon="lucide/stop-circle" />
            Stop impersonating
          </DropdownMenu.Item>
        {/if}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  </div>
</nav>
