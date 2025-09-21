<script lang="ts">
  import Input from "$lib/components/ui/input/input.svelte";
  import type { AnimalEventSchema } from "$lib/server/db/schema/animal_event.model";
  import type { FsSuperForm } from "formsnap";
  import FormControl from "../controls/FormControl.svelte";
  import FormField from "../fields/FormField.svelte";

  type In = AnimalEventSchema.InsertIn;

  let {
    form,
  }: {
    form: FsSuperForm<In>;
  } = $props();

  const form_data = form.form;
</script>

<FormField {form} name="data.vaccine_name" description="Name of the vaccine">
  <FormControl label="Vaccine name">
    {#snippet children({ props })}
      <Input
        {...props}
        bind:value={
          () =>
            $form_data.data.kind === "vaccine"
              ? $form_data.data.vaccine_name
              : "",
          (value) =>
            $form_data.data.kind === "vaccine" &&
            ($form_data.data.vaccine_name = value)
        }
      />
    {/snippet}
  </FormControl>
</FormField>
