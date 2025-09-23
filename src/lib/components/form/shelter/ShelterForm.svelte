<script lang="ts">
  import FormButton from "$lib/components/ui/form/form-button.svelte";
  import Input from "$lib/components/ui/input/input.svelte";
  import Textarea from "$lib/components/ui/textarea/textarea.svelte";
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
  import LinksFormFieldSet from "../links/LinksFormFieldSet.svelte";
  import GooglePlaceAutocomplete from "../place/GooglePlaceAutocomplete.svelte";

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
    form_input: SuperValidated<Out, App.Superforms.Message, In>;
  } = $props();

  const form = make_super_form(form_input, {
    submit,
    on_success,
  });

  const form_data = form.form;

  $inspect("$form_data", $form_data);
</script>

<form class="flex flex-col gap-2" method="POST" use:form.enhance>
  <div class="grid gap-3 md:grid-cols-3">
    <FormField {form} name="name" description="The name of the shelter">
      <FormControl label="Name">
        {#snippet children({ props })}
          <Input
            {...props}
            required
            placeholder="Name"
            bind:value={$form_data.name}
          />
        {/snippet}
      </FormControl>
    </FormField>

    <FormField
      {form}
      name="place"
      class="md:col-span-2"
      description="Where is the shelter located?"
    >
      <FormControl label="Location">
        {#snippet children({ props })}
          <GooglePlaceAutocomplete {...props} bind:place={$form_data.place} />
        {/snippet}
      </FormControl>
    </FormField>
  </div>

  <FormField {form} name="description" description="Tell us about the shelter">
    <FormControl label="Description">
      {#snippet children({ props })}
        <Textarea
          {...props}
          placeholder="Description"
          bind:value={$form_data.description}
        />
      {/snippet}
    </FormControl>
  </FormField>

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

  <DonationMethodsFormFieldSet {form} name="donation_methods" />

  <FormButton {form} class="w-full" icon={ICONS.EDIT}>
    Update shelter
  </FormButton>

  <FormMessage {form} />
</form>
