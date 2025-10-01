<script lang="ts">
  import Checkbox from "$lib/components/ui/checkbox/checkbox.svelte";
  import NaturalLanguageDatePicker from "$lib/components/ui/date-picker/NaturalLanguageDatePicker.svelte";
  import FormButton from "$lib/components/ui/form/form-button.svelte";
  import SingleSelect from "$lib/components/ui/select/SingleSelect.svelte";
  import { ANIMALS } from "$lib/const/animal.const";
  import type { MaybePromise } from "$lib/interfaces";
  import type {
    Animal,
    AnimalSchema,
  } from "$lib/server/db/schema/animal.model";
  import { Arrays } from "$lib/utils/arrays";
  import { make_super_form, type APIResult } from "$lib/utils/form.util";
  import { Format } from "$lib/utils/format.util";
  import { toast } from "svelte-sonner";
  import type { SuperValidated } from "sveltekit-superforms";
  import FormControl from "../controls/FormControl.svelte";
  import FormFieldControl from "../fields/FormFieldControl.svelte";
  import FormFieldSet from "../fieldset/FormFieldSet.svelte";
  import FormMessage from "../FormMessage.svelte";
  import SuperformInput from "../inputs/SuperformInput.svelte";
  import MicrochipLookupInput from "../microchip_lookup/MicrochipLookupInput.svelte";
  import MarkdownTextarea from "../textarea/MarkdownTextarea.svelte";

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

<form class="space-y-3" method="POST" use:form.enhance>
  <FormFieldControl
    {form}
    name="microchip_number"
    description="Their microchip number, if known. Can be used to look up more info"
    label="Microchip Number"
  >
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
  </FormFieldControl>

  <FormFieldControl
    {form}
    name="name"
    description="Can change later"
    label="Name"
  >
    {#snippet children({ props })}
      <SuperformInput {...props} {form} placeholder="Name" />
    {/snippet}
  </FormFieldControl>

  <div class="flex flex-wrap gap-3">
    <FormFieldControl {form} name="status" label="Status">
      {#snippet children({ props })}
        <SingleSelect
          {...props}
          placeholder="Select status"
          options={ANIMALS.STATUS.OPTIONS}
          bind:value={$form_data.status}
        />
      {/snippet}
    </FormFieldControl>

    <FormFieldControl {form} name="gender" label="Gender">
      {#snippet children({ props })}
        <SingleSelect
          {...props}
          placeholder="Select gender"
          options={ANIMALS.GENDER.OPTIONS}
          bind:value={$form_data.gender}
        />
      {/snippet}
    </FormFieldControl>

    <FormFieldControl {form} name="species" label="Species">
      {#snippet children({ props })}
        <SingleSelect
          {...props}
          placeholder="Select species"
          options={ANIMALS.SPECIES.OPTIONS}
          bind:value={$form_data.species}
        />
      {/snippet}
    </FormFieldControl>

    <FormFieldControl {form} name="breed" class="grow" label="Breed">
      {#snippet children({ props })}
        <SuperformInput
          {...props}
          {form}
          placeholder="Border Collie, Domestic Short Hair, etc"
        />
      {/snippet}
    </FormFieldControl>
  </div>

  <FormFieldSet
    {form}
    name="traits"
    legend="Traits"
    description="Select all that apply. This helps people find the right animal for them."
  >
    <div class="flex flex-wrap gap-3">
      {#each ANIMALS.TRAITS.OPTIONS as { label, value } (value)}
        <div class="w-36">
          <FormControl {label} horizontal>
            {#snippet children({ props })}
              <Checkbox
                {...props}
                {value}
                checked={$form_data.traits.includes(value)}
                onCheckedChange={(_) => {
                  $form_data = {
                    ...$form_data,
                    traits: Arrays.toggle($form_data.traits, value),
                  };
                }}
              />
            {/snippet}
          </FormControl>
        </div>
      {/each}
    </div>
  </FormFieldSet>

  <div class="flex flex-col gap-3 sm:flex-row">
    <FormFieldControl
      {form}
      class="grow"
      name="intake_date"
      description={$form_data.intake_date
        ? `${Format.date($form_data.intake_date)} (${Format.date_distance(
            $form_data.intake_date,
          )})`
        : "When did they get to the shelter? Approximate date is fine"}
      label="Intake Date"
    >
      {#snippet children({ props })}
        <NaturalLanguageDatePicker
          {...props}
          placeholder="Today, or 2 weeks ago"
          parsing_options={{ forwardDate: false }}
          bind:value={$form_data.intake_date}
        />
      {/snippet}
    </FormFieldControl>

    <FormFieldControl
      {form}
      class="grow"
      name="date_of_birth"
      description={$form_data.date_of_birth
        ? `Born on ${Format.date($form_data.date_of_birth)} (about ${Format.date_distance(
            $form_data.date_of_birth,
            { suffix: "old", numeric: "always" },
          )})`
        : "Roughly when was the animal born?"}
      label="Date of Birth"
    >
      {#snippet children({ props })}
        <NaturalLanguageDatePicker
          {...props}
          placeholder="5 years ago, or 16 June 2020"
          parsing_options={{ forwardDate: false }}
          bind:value={$form_data.date_of_birth}
        />
      {/snippet}
    </FormFieldControl>
  </div>

  <FormFieldControl
    {form}
    name="description"
    description="A short bio of the animal"
    label="Bio"
  >
    {#snippet children({ props })}
      <MarkdownTextarea
        {...props}
        placeholder="Fluffy is a sweet dog who loves to play fetch and cuddle."
        bind:value={$form_data.description}
      />
    {/snippet}
  </FormFieldControl>

  <FormButton {form} class="w-full" icon="lucide/send">Submit</FormButton>

  <FormMessage {form} />
</form>
