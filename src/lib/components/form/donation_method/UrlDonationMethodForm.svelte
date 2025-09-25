<script lang="ts">
  import type { DonationMethod } from "$lib/schema/donation_method.schema";
  import type { ShelterSchema } from "$lib/server/db/schema/shelter.model";
  import {
    fieldProxy,
    type FieldProxy,
    type FormPath,
    type SuperForm,
  } from "sveltekit-superforms";
  import FormControl from "../controls/FormControl.svelte";
  import UrlInput from "../inputs/URLInput.svelte";
  import { untrack } from "svelte";

  type T = ShelterSchema.InsertIn;
  type V = Extract<DonationMethod["data"], { kind: "url" }>;

  let {
    form,
    name,
  }: {
    form: SuperForm<T>;
    name: FormPath<T, V>;
  } = $props();

  const value = $derived(
    fieldProxy(
      untrack(() => form),
      name,
    ) satisfies FieldProxy<V>,
  );
  $inspect(name, $value);
</script>

<FormControl label="URL">
  {#snippet children({ props })}
    <UrlInput {...props} bind:value={$value.href} />
  {/snippet}
</FormControl>
