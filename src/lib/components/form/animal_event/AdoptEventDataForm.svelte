<script lang="ts">
  import type { AnimalEventSchema } from "$lib/server/db/schema/animal_event.model";
  import type { FsSuperForm } from "formsnap";
  import FormControl from "../controls/FormControl.svelte";
  import FormField from "../fields/FormField.svelte";
  import SuperformInput from "../inputs/SuperformInput.svelte";

  type In = AnimalEventSchema.InsertIn;

  let {
    form,
  }: {
    form: FsSuperForm<In>;
  } = $props();
</script>

<FormField
  {form}
  name="data.adopter_name"
  description="Name of the person adopting them"
>
  {#snippet children(props)}
    <FormControl {...props} label="Adopter Name">
      {#snippet children({ props })}
        <SuperformInput {...props} {form} />
      {/snippet}
    </FormControl>
  {/snippet}
</FormField>
