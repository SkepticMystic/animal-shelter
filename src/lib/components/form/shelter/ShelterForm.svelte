<script lang="ts">
  import FormButton from "$lib/components/ui/form/form-button.svelte";
  import { ICONS } from "$lib/const/icon.const";
  import type { MaybePromise } from "$lib/interfaces";
  import type {
    Shelter,
    ShelterSchema,
  } from "$lib/server/db/schema/shelter.model";
  import { make_super_form, type APIResult } from "$lib/utils/form.util";
  import type { SuperValidated } from "sveltekit-superforms";
  import FormControl from "../controls/FormControl.svelte";
  import DonationMethodsFormFieldSet from "../donation_method/DonationMethodsFormFieldSet.svelte";
  import FormField from "../fields/FormField.svelte";
  import FormMessage from "../FormMessage.svelte";
  import SuperformInput from "../inputs/SuperformInput.svelte";
  import LinksFormFieldSet from "../links/LinksFormFieldSet.svelte";
  import GooglePlaceAutocomplete from "../place/GooglePlaceAutocomplete.svelte";
  import MarkdownTextarea from "../textarea/MarkdownTextarea.svelte";

  type In = ShelterSchema.InsertIn;
  type Out = ShelterSchema.InsertOut;
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

  $inspect("$form_data", $form_data);
</script>

<form class="space-y-7" method="POST" use:form.enhance>
  <section>
    <div class="grid gap-3 md:grid-cols-3">
      <FormField {form} name="name" description="The name of the shelter">
        {#snippet children(props)}
          <FormControl {...props} label="Name">
            {#snippet children({ props })}
              <SuperformInput {...props} {form} required placeholder="Name" />
            {/snippet}
          </FormControl>
        {/snippet}
      </FormField>

      <FormField
        {form}
        name="place"
        class="md:col-span-2"
        description="Where is the shelter located?"
      >
        {#snippet children(props)}
          <FormControl {...props} label="Location">
            {#snippet children({ props })}
              <GooglePlaceAutocomplete
                {...props}
                bind:place={$form_data.place}
              />
            {/snippet}
          </FormControl>
        {/snippet}
      </FormField>
    </div>

    <FormField
      {form}
      name="description"
      description="Tell us about the shelter"
    >
      {#snippet children(props)}
        <FormControl {...props} label="Description">
          {#snippet children({ props })}
            <MarkdownTextarea {...props} bind:value={$form_data.description} />
          {/snippet}
        </FormControl>
      {/snippet}
    </FormField>
  </section>

  <section class="space-y-3">
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

  <section class="space-y-3">
    <h4>Donations</h4>

    <FormField
      {form}
      class="w-fit"
      name="npo_number"
      description="Non-Profit Organization registration number"
    >
      {#snippet children(props)}
        <FormControl {...props} label="NPO Number">
          {#snippet children({ props })}
            <SuperformInput {...props} {form} placeholder="123-456 NPO" />
          {/snippet}
        </FormControl>
      {/snippet}
    </FormField>

    <DonationMethodsFormFieldSet {form} name="donation_methods" />
  </section>

  <FormButton {form} class="w-full" icon={ICONS.EDIT}>
    Update shelter
  </FormButton>

  <FormMessage {form} />
</form>
