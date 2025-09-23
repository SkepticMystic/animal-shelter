<script lang="ts">
  import NaturalLanguageDatePicker from "$lib/components/ui/date-picker/NaturalLanguageDatePicker.svelte";
  import FormButton from "$lib/components/ui/form/form-button.svelte";
  import Input from "$lib/components/ui/input/input.svelte";
  import SingleSelect from "$lib/components/ui/select/SingleSelect.svelte";
  import Textarea from "$lib/components/ui/textarea/textarea.svelte";
  import { ANIMALS } from "$lib/const/animal.const";
  import type { MaybePromise } from "$lib/interfaces";
  import type {
    Animal,
    AnimalSchema,
  } from "$lib/server/db/schema/animal.model";
  import { make_super_form, type APIResult } from "$lib/utils/form.util";
  import { Format } from "$lib/utils/format.util";
  import { toast } from "svelte-sonner";
  import type { SuperValidated } from "sveltekit-superforms";
  import FormControl from "../controls/FormControl.svelte";
  import FormField from "../fields/FormField.svelte";
  import FormMessage from "../FormMessage.svelte";
  import MicrochipLookupInput from "../microchip_lookup/MicrochipLookupInput.svelte";

  type In = AnimalSchema.InsertIn;
  type Parsed = AnimalSchema.InsertOut;

  let {
    submit,
    on_success,
    form_input,
  }: {
    submit: (data: In) => Promise<APIResult<Animal>>;
    on_success?: (animal: Animal) => MaybePromise<void>;
    form_input: SuperValidated<Parsed, App.Superforms.Message, In>;
  } = $props();

  const form = make_super_form(form_input, {
    submit,
    on_success,
  });

  const { form: form_data } = form;

  // NOTE: Lol, if I don't read $form_data, the default values are blank...
  $inspect($form_data);
</script>

<form class="flex flex-col gap-2" method="POST" use:form.enhance>
  <FormField
    {form}
    name="microchip_number"
    description="Their microchip number, if known. Can be used to look up more info"
  >
    <FormControl label="Microchip Number">
      {#snippet children({ props })}
        <MicrochipLookupInput
          {...props}
          on_success={({ merged }) => {
            if (
              !merged.found ||
              !confirm(
                "Microchip data found. Do you want to fill in the form with this data? This may overwrite existing data in the form.",
              )
            ) {
              return;
            }

            $form_data = { ...$form_data, ...merged.animal };
            toast.success("Microchip data found and filled in");
          }}
          bind:microchip_number={$form_data.microchip_number}
        />
      {/snippet}
    </FormControl>
  </FormField>

  <FormField {form} name="name" description="Can change later">
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

  <div class="flex flex-wrap gap-3">
    <FormField {form} name="gender" description="">
      <FormControl label="Gender">
        {#snippet children({ props })}
          <SingleSelect
            {...props}
            required
            placeholder="Select gender"
            options={ANIMALS.GENDER.OPTIONS}
            bind:value={$form_data.gender}
          />
        {/snippet}
      </FormControl>
    </FormField>

    <FormField {form} name="species" description="">
      <FormControl label="Species">
        {#snippet children({ props })}
          <SingleSelect
            {...props}
            required
            placeholder="Select species"
            options={ANIMALS.SPECIES.OPTIONS}
            bind:value={$form_data.species}
          />
        {/snippet}
      </FormControl>
    </FormField>

    <FormField {form} name="breed" class="grow" description="">
      <FormControl label="Breed">
        {#snippet children({ props })}
          <Input
            {...props}
            required
            placeholder="Border Collie, Domestic Short Hair, etc"
            bind:value={$form_data.breed}
          />
        {/snippet}
      </FormControl>
    </FormField>
  </div>

  <div class="flex flex-col gap-3 sm:flex-row">
    <FormField
      {form}
      class="grow"
      name="intake_date"
      description={$form_data.intake_date
        ? `${Format.date($form_data.intake_date)} (${Format.date_distance(
            $form_data.intake_date,
            {},
          )})`
        : "When did they get to the shelter? Approximate date is fine"}
    >
      <FormControl label="Intake Date">
        {#snippet children({ props })}
          <NaturalLanguageDatePicker
            {...props}
            placeholder="Today, or 2 weeks ago"
            parsing_options={{ forwardDate: false }}
            bind:value={$form_data.intake_date}
          />
        {/snippet}
      </FormControl>
    </FormField>

    <FormField
      {form}
      class="grow"
      name="date_of_birth"
      description={$form_data.date_of_birth
        ? `Born on ${Format.date($form_data.date_of_birth)} (about ${Format.date_distance(
            $form_data.date_of_birth,
            { suffix: false },
          )} old)`
        : "Roughly when was the animal born?"}
    >
      <FormControl label="Date of Birth">
        {#snippet children({ props })}
          <NaturalLanguageDatePicker
            {...props}
            placeholder="5 years ago, or 16 June 2020"
            parsing_options={{ forwardDate: false }}
            bind:value={$form_data.date_of_birth}
          />
        {/snippet}
      </FormControl>
    </FormField>
  </div>

  <FormField {form} name="description" description="A short bio of the animal">
    <FormControl label="Bio">
      {#snippet children({ props })}
        <Textarea
          {...props}
          placeholder="Bio"
          bind:value={$form_data.description}
        />
      {/snippet}
    </FormControl>
  </FormField>

  <FormButton {form} class="w-full" icon="lucide/send">Submit</FormButton>

  <FormMessage {form} />
</form>
