<script lang="ts">
  import FormFieldset from "$lib/components/form/fields/FormFieldSet.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import FormButton from "$lib/components/ui/form/form-button.svelte";
  import Input from "$lib/components/ui/input/input.svelte";
  import Textarea from "$lib/components/ui/textarea/textarea.svelte";
  import { ICONS } from "$lib/const/icon.const";
  import { LINKS } from "$lib/const/link.const";
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
  import LinkInput from "../inputs/LinkInput.svelte";
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

      remove: (field: LinkField, link_id: string) => {
        $form_data[field] = $form_data[field].filter(
          (link) => link.id !== link_id,
        );
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

  <FormFieldset
    {form}
    name="phones"
    legend="Phone numbers"
    class="space-y-3 rounded-md border px-3 pb-2"
    description="Optional phone numbers to contact the shelter."
  >
    <div class="grid gap-3 sm:grid-cols-2">
      {#each $form_data.phones as phone, phone_i (phone.id)}
        <LinkInput
          {form}
          name="phones[{phone_i}]"
          on_remove={() => actions.links.remove("phones", phone.id)}
          bind:link={$form_data.phones[phone_i]}
        >
          {#snippet href_input({ props })}
            <TelInput
              {...props}
              bind:value={
                () => LinkUtil.format_href($form_data.phones[phone_i]),
                (value) => ($form_data.phones[phone_i].href = value)
              }
            />
          {/snippet}
        </LinkInput>
      {/each}

      <Button
        type="button"
        variant="outline"
        icon={LINKS.KIND.MAP["tel"].icon}
        onclick={() => actions.links.add("phones")}
      >
        Add phone number
      </Button>
    </div>
  </FormFieldset>

  <!--  -->

  <FormFieldset
    {form}
    name="emails"
    legend="Email addresses"
    class="space-y-3 rounded-md border px-3 pb-2"
    description="Optional email addresses to contact the shelter."
  >
    <div class="grid gap-3 sm:grid-cols-2">
      {#each $form_data.emails as email, email_i (email.id)}
        <LinkInput
          {form}
          name="emails[{email_i}]"
          on_remove={() => actions.links.remove("emails", email.id)}
          bind:link={$form_data.emails[email_i]}
        >
          {#snippet href_input({ props })}
            <EmailInput
              {...props}
              bind:value={
                () => LinkUtil.format_href($form_data.emails[email_i]),
                (value) => ($form_data.emails[email_i].href = value)
              }
            />
          {/snippet}
        </LinkInput>
      {/each}

      <Button
        type="button"
        variant="outline"
        icon={LINKS.KIND.MAP["mailto"].icon}
        onclick={() => actions.links.add("emails")}
      >
        Add email address
      </Button>
    </div>
  </FormFieldset>

  <!--  -->

  <FormFieldset
    {form}
    name="urls"
    legend="Links"
    class="space-y-3 rounded-md border px-3 pb-2"
    description="Optional links to the shelter's website or social media profiles."
  >
    <div class="grid gap-3 sm:grid-cols-2">
      <!-- WARN: Don't bind to _link, rather use $form_data.links[link_i] -->
      {#each $form_data.urls as url, url_i (url.id)}
        <LinkInput
          {form}
          name="urls[{url_i}]"
          on_remove={() => actions.links.remove("urls", url.id)}
          bind:link={$form_data.urls[url_i]}
        >
          {#snippet href_input({ props })}
            <Input
              {...props}
              placeholder="www.example.com"
              bind:value={
                () => LinkUtil.format_href($form_data.urls[url_i]),
                (value) => ($form_data.urls[url_i].href = value)
              }
            />
          {/snippet}
        </LinkInput>
      {/each}

      <Button
        type="button"
        variant="outline"
        icon={LINKS.KIND.MAP["https"].icon}
        onclick={() => actions.links.add("urls")}
      >
        Add link
      </Button>
    </div>
  </FormFieldset>

  <FormButton {form} class="w-full" icon={ICONS.EDIT}>
    Update shelter
  </FormButton>

  <FormMessage {form} />
</form>
