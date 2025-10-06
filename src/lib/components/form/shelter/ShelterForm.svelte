<script lang="ts">
  import FormButton from "$lib/components/ui/form/form-button.svelte";
  import InputGroupText from "$lib/components/ui/input-group/input-group-text.svelte";
  import Input from "$lib/components/ui/input/input.svelte";
  import { ICONS } from "$lib/const/icon.const";
  import type { MaybePromise } from "$lib/interfaces";
  import type {
    Shelter,
    ShelterSchema,
  } from "$lib/server/db/schema/shelter.model";
  import { make_super_form, type APIResult } from "$lib/utils/form.util";
  import type { SuperValidated } from "sveltekit-superforms";
  import DonationMethodsFormFieldSet from "../donation_method/DonationMethodsFormFieldSet.svelte";
  import FormFieldControl from "../fields/FormFieldControl.svelte";
  import FormMessage from "../FormMessage.svelte";
  import SuperformInput from "../inputs/SuperformInput.svelte";
  import LinksFormFieldSet from "../links/LinksFormFieldSet.svelte";
  import GooglePlaceAutocomplete from "../place/GooglePlaceAutocomplete.svelte";
  import MarkdownTextarea from "../textarea/MarkdownTextarea.svelte";

  type In = ShelterSchema.InsertIn;
  type Data = Shelter;

  let {
    submit,
    on_success,
    form_input,
  }: {
    submit: (validated: In) => Promise<APIResult<Data>>;
    on_success?: (data: Data) => MaybePromise<unknown>;
    form_input: SuperValidated<In>;
  } = $props();

  const form = make_super_form(form_input, {
    submit,
    on_success,
  });

  const form_data = form.form;
</script>

<form class="space-y-7" method="POST" use:form.enhance>
  <section>
    <div class="grid gap-3 md:grid-cols-3">
      <FormFieldControl
        {form}
        name="name"
        description="The name of the shelter"
        label="Name"
      >
        {#snippet children({ props })}
          <SuperformInput {...props} {form} required placeholder="Name" />
        {/snippet}
      </FormFieldControl>

      <FormFieldControl
        {form}
        name="place"
        class="md:col-span-2"
        description="Where is the shelter located?"
        label="Location"
      >
        {#snippet children({ props })}
          <GooglePlaceAutocomplete {...props} bind:place={$form_data.place} />
        {/snippet}
      </FormFieldControl>
    </div>

    <FormFieldControl
      {form}
      name="description"
      description="Tell us about the shelter"
      label="Description"
    >
      {#snippet children({ props })}
        <MarkdownTextarea {...props} bind:value={$form_data.description} />
      {/snippet}
    </FormFieldControl>
  </section>

  <section>
    <h4>Contact Info & Links</h4>

    <LinksFormFieldSet
      {form}
      kind="tel"
      name="phones"
      legend="Phone numbers"
      description="Optional phone numbers to contact the shelter."
    />
    <LinksFormFieldSet
      {form}
      kind="mailto"
      name="emails"
      legend="Email addresses"
      description="Optional email addresses to contact the shelter."
    />
    <LinksFormFieldSet
      {form}
      name="urls"
      kind="https"
      legend="Links"
      description="Optional links to the shelter's website or social media profiles."
    />
  </section>

  <section>
    <h4>Donations</h4>

    <FormFieldControl
      {form}
      name="npo_number"
      class="w-72"
      description="Non-profit organization registration number"
      label="NPO Number"
    >
      {#snippet children({ props })}
        <Input
          {...props}
          maxlength={7}
          placeholder="123-456"
          bind:value={$form_data.npo_number}
        >
          {#snippet addon()}
            <InputGroupText>NPO</InputGroupText>
          {/snippet}
        </Input>
      {/snippet}
    </FormFieldControl>

    <DonationMethodsFormFieldSet {form} name="donation_methods" />
  </section>

  <FormButton {form} class="w-full" icon={ICONS.EDIT}>
    Update shelter
  </FormButton>

  <FormMessage {form} />
</form>
