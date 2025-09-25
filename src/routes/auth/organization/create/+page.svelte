<script lang="ts">
  import { OrganizationClient } from "$lib/clients/organizations.client.js";
  import OrganizationForm from "$lib/components/form/organization/OrganizationForm.svelte";

  let { data } = $props();
</script>

<article>
  <header class="flex items-end justify-between">
    <h1>Create a new Shelter</h1>
  </header>

  <OrganizationForm
    form_input={data.form_input}
    on_success={(_data) => close()}
    submit={OrganizationClient.create}
  />
</article>
