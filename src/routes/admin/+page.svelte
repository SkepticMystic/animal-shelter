<script lang="ts">
  import type { ResolvedPathname } from "$app/types";

  type Route = {
    label: string;
    routes?: Route[];
    href: ResolvedPathname;
  };

  const routes: Route[] = [
    {
      label: "Users",
      href: "/admin/users",
    },
  ];
</script>

<div class="my-card">
  <h2>Admin</h2>

  <ul class="my-3 list-inside list-disc">
    {#each routes as route (route.href)}
      <li>
        <a class="link link-primary" href={route.href}>
          {route.label}
        </a>

        {#if route.routes?.length}
          <ul class="list-inside list-disc pl-5">
            {#each route.routes as subroute (subroute.href)}
              <li>
                <a class="link link-primary" href={subroute.href}>
                  {subroute.label}
                </a>
              </li>
            {/each}
          </ul>
        {/if}
      </li>
    {/each}
  </ul>
</div>
