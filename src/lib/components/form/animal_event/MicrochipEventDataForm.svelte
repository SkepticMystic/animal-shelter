<script lang="ts">
  import type { AnimalEventSchema } from "$lib/server/db/schema/animal_event.model";
  import type { FsSuperForm } from "formsnap";
  import { toast } from "svelte-sonner";
  import FormControl from "../controls/FormControl.svelte";
  import FormField from "../fields/FormField.svelte";
  import MicrochipLookupInput from "../microchip_lookup/MicrochipLookupInput.svelte";

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
  name="data.microchip_number"
  description="The microchip number"
>
  <FormControl label="Microchip Number">
    {#snippet children({ props })}
      <MicrochipLookupInput
        {...props}
        on_success={({ merged }) => {
          if (!merged.found) return;

          $form_data.data = { ...$form_data.data, ...merged.animal_event };

          toast.success("Microchip data found and filled in");
        }}
        bind:microchip_number={
          () =>
            $form_data.data.kind === "microchip"
              ? $form_data.data.microchip_number
              : "",
          (value) =>
            $form_data.data.kind === "microchip" &&
            ($form_data.data.microchip_number = value)
        }
      />
    {/snippet}
  </FormControl>
</FormField>
