<script lang="ts">
  import type { DonationMethod } from "$lib/schema/donation_method.schema";
  import type { ShelterSchema } from "$lib/server/db/schema/shelter.model";
  import { type FormPath, type SuperForm } from "sveltekit-superforms";
  import FormFieldControl from "../fields/FormFieldControl.svelte";
  import SuperformInput from "../inputs/SuperformInput.svelte";

  type T = ShelterSchema.InsertIn;
  type V = Extract<DonationMethod["data"], { kind: "bank" }>;

  let {
    form,
    name,
  }: {
    form: SuperForm<T>;
    name: FormPath<T, V>;
  } = $props();
</script>

<FormFieldControl {form} name="{name}.bank_name" label="Bank Name">
  {#snippet children({ props })}
    <SuperformInput
      {...props}
      {form}
      placeholder="Standard Bank, Capitec, FNB, etc."
    />
  {/snippet}
</FormFieldControl>

<FormFieldControl
  {form}
  name="{name}.reference"
  description="e.g. 'Name and Surname'"
  label="Reference"
>
  {#snippet children({ props })}
    <SuperformInput {...props} {form} />
  {/snippet}
</FormFieldControl>

<FormFieldControl {form} name="{name}.swift_code" label="Swift Code (optional)">
  {#snippet children({ props })}
    <SuperformInput {...props} {form} />
  {/snippet}
</FormFieldControl>

<FormFieldControl
  {form}
  name="{name}.branch_code"
  description="Not always required"
  label="Branch Code (optional)"
>
  {#snippet children({ props })}
    <SuperformInput {...props} {form} />
  {/snippet}
</FormFieldControl>

<FormFieldControl
  {form}
  name="{name}.account_number"
  description="Your bank account number"
  label="Account Number"
>
  {#snippet children({ props })}
    <SuperformInput {...props} {form} />
  {/snippet}
</FormFieldControl>
