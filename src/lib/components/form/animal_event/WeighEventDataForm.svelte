<script lang="ts">
  import Input from "$lib/components/ui/input/input.svelte";
  import type { AnimalEventSchema } from "$lib/server/db/schema/animal_event.model";
  import type { FsSuperForm } from "formsnap";
  import FormFieldControl from "../fields/FormFieldControl.svelte";

  type In = AnimalEventSchema.InsertIn;

  let {
    form,
  }: {
    form: FsSuperForm<In>;
  } = $props();

  const form_data = form.form;
</script>

<FormFieldControl
  {form}
  name="data.grams"
  description="Weight in kg"
  label="Weight (kg)"
>
  {#snippet children({ props })}
    <Input
      {...props}
      type="number"
      class="w-fit"
      min="0.001"
      step="0.001"
      bind:value={
        () =>
          $form_data.data.kind === "weigh" ? $form_data.data.grams / 1000 : 0,
        (value) =>
          $form_data.data.kind === "weigh" &&
          ($form_data.data.grams = Math.round(value * 1000))
      }
    />
  {/snippet}
</FormFieldControl>
