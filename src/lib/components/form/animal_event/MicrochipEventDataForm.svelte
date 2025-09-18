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

  const { form: form_data } = form;
</script>

<FormField
  {form}
  name="data.microchip_id"
  description="The microchip ID/number"
>
  <FormControl label="Microchip ID / Number">
    {#snippet children({ props })}
      <Input
        {...props}
        bind:value={
          () =>
            $form_data.data.kind === "microchip"
              ? $form_data.data.microchip_id
              : "",
          (value) =>
            $form_data.data.kind === "microchip" &&
            ($form_data.data.microchip_id = value)
        }
      />
    {/snippet}
  </FormControl>
</FormField>

<!-- TODO: Possible search API integration with: https://findmychip.co.za -->
