<script lang="ts">
  import Icon from "$lib/components/ui/icon/Icon.svelte";
  import type { DonationMethod } from "$lib/schema/donation_method.schema";
  import type { ShelterSchema } from "$lib/server/db/schema/shelter.model";
  import {
    fieldProxy,
    type FormPath,
    type SuperForm,
  } from "sveltekit-superforms";
  import FormControl from "../controls/FormControl.svelte";
  import FormField from "../fields/FormField.svelte";
  import SuperformInput from "../inputs/SuperformInput.svelte";
  import BankDonationMethodForm from "./BankDonationMethodForm.svelte";
  import UrlDonationMethodForm from "./UrlDonationMethodForm.svelte";

  let {
    form,
    name,
  }: {
    form: SuperForm<ShelterSchema.InsertOut>;
    name: FormPath<ShelterSchema.InsertOut, DonationMethod>;
  } = $props();

  const donation_method = $derived(fieldProxy(form, name));

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

  <FormField {form} name="{name}.label">
    {#snippet children(props)}
      <FormControl {...props} label="Label (optional)">
        {#snippet children({ props })}
          <div class="relative">
            <SuperformInput
              {...props}
              {form}
              class="pr-7"
              placeholder="Paypal, Bank Transfer, etc."
            />

            <Icon
              icon="lucide/tag"
              class="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 opacity-60"
            />
          </div>
        {/snippet}
      </FormControl>
    {/snippet}
  </FormField>

  {#if $donation_method.data.kind === "bank"}
    <BankDonationMethodForm {form} name="{name}.data" />
  {:else if $donation_method.data.kind === "url"}
    <UrlDonationMethodForm {form} name="{name}.data" />
  {/if}
</div>
