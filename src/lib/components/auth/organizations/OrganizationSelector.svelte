<script lang="ts">
  import { OrganizationsClient } from "$lib/clients/organizations.client";
  import SingleSelect from "$lib/components/ui/select/SingleSelect.svelte";
  import { organizations } from "$lib/stores/organizations.store";
  import { session } from "$lib/stores/session";
</script>

{#if $session.data?.session.activeOrganizationId && $organizations.data && $organizations.data.length > 1}
  <SingleSelect
    on_value_select={OrganizationsClient.set_active}
    value={$session.data.session.activeOrganizationId}
    options={$organizations.data.map((org) => ({
      value: org.id,
      label: org.name,
    })) ?? []}
  />
{/if}
