<script lang="ts">
  import type { DonationMethod } from "$lib/schema/donation_method.schema";
  import type { ShelterSchema } from "$lib/server/db/schema/shelter.model";
  import { type FormPath, type SuperForm } from "sveltekit-superforms";
  import FormControl from "../controls/FormControl.svelte";
  import FormField from "../fields/FormField.svelte";
  import FormInput from "../inputs/SuperformInput.svelte";

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

<FormField {form} name="{name}.bank_name">
  {#snippet children(props)}
    <FormControl {...props} label="Bank Name">
      {#snippet children({ props })}
        <FormInput
          {...props}
          {form}
          placeholder="Standard Bank, Capitec, FNB, etc."
        />
      {/snippet}
    </FormControl>
  {/snippet}
</FormField>

<FormField {form} name="{name}.reference" description="e.g. 'Name and Surname'">
  {#snippet children(props)}
    <FormControl {...props} label="Reference">
      {#snippet children({ props })}
        <FormInput {...props} {form} />
      {/snippet}
    </FormControl>
  {/snippet}
</FormField>

<FormField {form} name="{name}.swift_code">
  {#snippet children(props)}
    <FormControl {...props} label="Swift Code (optional)">
      {#snippet children({ props })}
        <FormInput {...props} {form} />
      {/snippet}
    </FormControl>
  {/snippet}
</FormField>

<FormField {form} name="{name}.branch_code" description="Not always required">
  {#snippet children(props)}
    <FormControl {...props} label="Branch Code (optional)">
      {#snippet children({ props })}
        <FormInput {...props} {form} />
      {/snippet}
    </FormControl>
  {/snippet}
</FormField>

<FormField
  {form}
  name="{name}.account_number"
  description="Your bank account number"
>
  {#snippet children(props)}
    <FormControl {...props} label="Account Number">
      {#snippet children({ props })}
        <FormInput {...props} {form} />
      {/snippet}
    </FormControl>
  {/snippet}
</FormField>
