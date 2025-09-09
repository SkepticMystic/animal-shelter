<script lang="ts">
  import DatePicker from "$lib/components/ui/date-picker/DatePicker.svelte";
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
  import type { SuperValidated } from "sveltekit-superforms";
  import FormControl from "../controls/FormControl.svelte";
  import FormField from "../fields/FormField.svelte";
  import FormMessage from "../FormMessage.svelte";

  type In = AnimalSchema.Insert;
  type Out = Animal;

  let {
    submit,
    on_success,
    form_input,
  }: {
    form_input: SuperValidated<In>;

    submit: (data: In) => Promise<APIResult<Out>>;
    on_success?: (animal: Out) => MaybePromise<void>;
  } = $props();

  const form = make_super_form(form_input, {
    submit,
    on_success,
  });

  const { form: form_data } = form;
</script>

<form class="flex flex-col gap-2" method="POST" use:form.enhance>
  <FormField {form} name="name" description="The name of the animal">
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

  <div class="flex gap-x-2">
    <FormField {form} name="species" description="The species of the animal">
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

    <FormField
      {form}
      name="date_of_birth"
      description="The date of birth of the animal. Approximate is fine."
    >
      <FormControl label="Date of birth">
        {#snippet children({ props })}
          <DatePicker {...props} bind:value={$form_data.date_of_birth} />
        {/snippet}
      </FormControl>
    </FormField>
  </div>

  <FormField {form} name="bio" description="A short bio of the animal">
    <FormControl label="Bio">
      {#snippet children({ props })}
        <Textarea {...props} placeholder="Bio" bind:value={$form_data.bio} />
      {/snippet}
    </FormControl>
  </FormField>

  <FormButton {form} class="w-full" icon="lucide/send">Submit</FormButton>

  <FormMessage {form} />
</form>
