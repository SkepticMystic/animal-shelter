<script lang="ts">
  import type { DonationMethod } from "$lib/schema/donation_method.schema";
  import type { ShelterSchema } from "$lib/server/db/schema/shelter.model";
  import { untrack } from "svelte";
  import {
    fieldProxy,
    type FormPath,
    type SuperForm,
  } from "sveltekit-superforms";
  import FormFieldControl from "../fields/FormFieldControl.svelte";
  import SuperformInput from "../inputs/SuperformInput.svelte";
  import BankDonationMethodForm from "./BankDonationMethodForm.svelte";
  import UrlDonationMethodForm from "./UrlDonationMethodForm.svelte";

  let {
    form,
    name,
  }: {
    form: SuperForm<ShelterSchema.InsertIn>;
    name: FormPath<ShelterSchema.InsertIn, DonationMethod>;
  } = $props();

  const donation_method = $derived(
    fieldProxy(
      untrack(() => form),
      name,
    ),
  );

  // const set_kind = (kind: IDonationMethod.KindId) => {
  //   $donation_method = {
  //     ...$donation_method,
  //     data: { ...DONATION_METHOD.KIND.DEFAULTS[kind] },
  //   };
  // };
</script>

<div class="space-y-3">
  <!-- <FormField
    {form}
    name="{name}.data.kind"
    description="The method of donation"
  >
    {#snippet children(props)}
      <FormControl {...props} label="Method">
        {#snippet children({ props })}
          <SingleSelect
            {...props}
            options={DONATION_METHOD.KIND.OPTIONS}
            bind:value={
              () => $donation_method.data.kind, (kind) => set_kind(kind)
            }
          />
        {/snippet}
      </FormControl>
    {/snippet}
  </FormField> -->

  <FormFieldControl {form} name="{name}.label" label="Label (optional)">
    {#snippet children({ props })}
      <SuperformInput
        {...props}
        {form}
        icon="lucide/tag"
        placeholder="Paypal, Bank Transfer, etc."
      />
    {/snippet}
  </FormFieldControl>

  {#if $donation_method.data.kind === "bank"}
    <BankDonationMethodForm {form} name="{name}.data" />
  {:else if $donation_method.data.kind === "url"}
    <UrlDonationMethodForm {form} name="{name}.data" />
  {/if}
</div>
