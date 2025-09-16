<script lang="ts">
  import FormFieldset from "$lib/components/form/fields/FormFieldSet.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import FormButton from "$lib/components/ui/form/form-button.svelte";
  import FormElementField from "$lib/components/ui/form/form-element-field.svelte";
  import Input from "$lib/components/ui/input/input.svelte";
  import { ICONS } from "$lib/const/icon.const";
  import type { MaybePromise } from "$lib/interfaces";
  import type {
    Shelter,
    ShelterSchema,
  } from "$lib/server/db/schema/shelter.model";
  import { make_super_form, type APIResult } from "$lib/utils/form.util";
  import { LinkUtil } from "$lib/utils/link/link.util";
  import type { SuperValidated } from "sveltekit-superforms";
  import FormControl from "../controls/FormControl.svelte";
  import FormField from "../fields/FormField.svelte";
  import FormMessage from "../FormMessage.svelte";
  import EmailInput from "../inputs/EmailInput.svelte";
  import TelInput from "../inputs/TelInput.svelte";
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

  const { form: form_data } = form;

  type LinkField = keyof Pick<Shelter, "urls" | "emails" | "phones">;
  const actions = {
    links: {
      add: (field: LinkField) => {
        $form_data[field] = [
          ...$form_data[field],
          {
            href: "",
            label: "",
            id: crypto.randomUUID().split("-")[0],
          },
        ];
      },

      remove: (field: LinkField, index: number) => {
        $form_data[field] = $form_data[field].filter((_, i) => i !== index);
      },
    },
  };
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

  <FormFieldset
    {form}
    name="phones"
    legend="Phone numbers"
    class="space-y-3 rounded-md border px-3 pb-2"
    description="Optional phone numbers to contact the shelter."
  >
    <div class="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {#each $form_data.phones as _phone, phone_i (_phone.id)}
        <div class="flex gap-0.5">
          <FormElementField {form} class="grow" name="phones[{phone_i}].href">
            <FormControl label="">
              {#snippet children({ props })}
                <TelInput
                  {...props}
                  bind:value={
                    () => LinkUtil.format_href($form_data.phones[phone_i]),
                    (value) => ($form_data.phones[phone_i].href = value)
                  }
                />
              {/snippet}
            </FormControl>
          </FormElementField>
          <!-- 
          <FormElementField {form} name="phones[{phone_i}].label">
            <FormControl label="">
              {#snippet children({ props })}
                <Input
                  {...props}
                  placeholder="Contact name (optional)"
                  bind:value={$form_data.phones[phone_i].label}
                />
              {/snippet}
            </FormControl>
          </FormElementField> -->

          <Button
            type="button"
            variant="warning"
            icon={ICONS.CLOSE}
            title="Remove phone"
            onclick={() => actions.links.remove("phones", phone_i)}
          />
        </div>
      {/each}
    </div>

    <Button
      type="button"
      variant="outline"
      class="w-full"
      icon={ICONS.ADD}
      onclick={() => actions.links.add("phones")}
    >
      Add phone number
    </Button>
  </FormFieldset>

  <!--  -->

  <FormFieldset
    {form}
    name="emails"
    legend="Email addresses"
    class="space-y-3 rounded-md border px-3 pb-2"
    description="Optional email addresses to contact the shelter."
  >
    <div class="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {#each $form_data.emails as _email, email_i (_email.id)}
        <div class="flex gap-0.5">
          <FormElementField {form} class="grow" name="emails[{email_i}].href">
            <FormControl label="">
              {#snippet children({ props })}
                <EmailInput
                  {...props}
                  bind:value={
                    () => LinkUtil.format_href($form_data.emails[email_i]),
                    (value) => ($form_data.emails[email_i].href = value)
                  }
                />
              {/snippet}
            </FormControl>
          </FormElementField>
          <!-- 
          <FormElementField {form} name="emails[{email_i}].label">
            <FormControl label="">
              {#snippet children({ props })}
                <Input
                  {...props}
                  placeholder="Contact name (optional)"
                  bind:value={$form_data.emails[email_i].label}
                />
              {/snippet}
            </FormControl>
          </FormElementField> -->

          <Button
            type="button"
            variant="warning"
            icon={ICONS.CLOSE}
            title="Remove email"
            onclick={() => actions.links.remove("emails", email_i)}
          />
        </div>
      {/each}
    </div>

    <Button
      type="button"
      variant="outline"
      class="w-full"
      icon={ICONS.ADD}
      onclick={() => actions.links.add("emails")}
    >
      Add email address
    </Button>
  </FormFieldset>

  <!--  -->

  <FormFieldset
    {form}
    name="urls"
    legend="Links"
    class="space-y-3 rounded-md border px-3 pb-2"
    description="Optional links to the shelter's website or social media profiles."
  >
    <div class="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      <!-- WARN: Don't bind to _link, rather use $form_data.links[link_i] -->
      {#each $form_data.urls as _url, url_i (_url.id)}
        <div class="flex gap-0.5">
          <FormElementField {form} class="grow" name="urls[{url_i}].href">
            <FormControl label="">
              {#snippet children({ props })}
                <Input
                  {...props}
                  placeholder="https://example.com"
                  bind:value={
                    () => LinkUtil.format_href($form_data.urls[url_i]),
                    (value) => ($form_data.urls[url_i].href = value)
                  }
                />
              {/snippet}
            </FormControl>
          </FormElementField>
          <!-- 
          <FormElementField {form} name="urls[{url_i}].label">
            <FormControl label="">
              {#snippet children({ props })}
                <Input
                  {...props}
                  placeholder="Label (optional)"
                  bind:value={$form_data.urls[url_i].label}
                />
              {/snippet}
            </FormControl>
          </FormElementField> -->

          <Button
            type="button"
            variant="warning"
            icon={ICONS.CLOSE}
            title="Remove link"
            onclick={() => actions.links.remove("urls", url_i)}
          />
        </div>
      {/each}
    </div>

    <Button
      type="button"
      variant="outline"
      class="w-full"
      icon={ICONS.ADD}
      onclick={() => actions.links.add("urls")}
    >
      Add link
    </Button>
  </FormFieldset>

  <FormButton {form} class="w-full" icon={ICONS.EDIT}>
    Update shelter
  </FormButton>

  <FormMessage {form} />
</form>
