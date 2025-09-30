<script lang="ts">
  import type { AnimalEventSchema } from "$lib/server/db/schema/animal_event.model";
  import type { FsSuperForm } from "formsnap";
  import FormFieldControl from "../fields/FormFieldControl.svelte";
  import SuperformInput from "../inputs/SuperformInput.svelte";

  type In = AnimalEventSchema.InsertIn;

  let {
    form,
  }: {
    form: FsSuperForm<In>;
  } = $props();
</script>

<FormFieldControl
  {form}
  name="data.fosterer_name"
  description="Name of the person fostering them"
  label="Fosterer Name"
>
  {#snippet children({ props })}
    <SuperformInput {...props} {form} />
  {/snippet}
</FormFieldControl>
