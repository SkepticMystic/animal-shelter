<script lang="ts">
  import Input from "$lib/components/ui/input/input.svelte";
  import type { AnimalEventSchema } from "$lib/server/db/schema/animal_event.model";
  import type { FsSuperForm } from "formsnap";
  import FormControl from "../controls/FormControl.svelte";
  import FormField from "../fields/FormField.svelte";

  type In = AnimalEventSchema.InsertIn;

  let {
    form,
    form_data,
  }: {
    form: FsSuperForm<In>;
    form_data: FsSuperForm<In>["form"];
  } = $props();
</script>

<FormField {form} name="data.grams" description="Weight in kg">
  <FormControl label="Weight (kg)">
    {#snippet children({ props })}
      <Input
        {...props}
        type="number"
        class="w-fit"
        min="0.001"
        step="0.001"
        bind:value={
          () =>
            $form_data.data.kind === "weighing"
              ? $form_data.data.grams / 1000
              : 0,
          (value) =>
            $form_data.data.kind === "weighing" &&
            ($form_data.data.grams = Math.round(value * 1000))
        }
      />
    {/snippet}
  </FormControl>
</FormField>
