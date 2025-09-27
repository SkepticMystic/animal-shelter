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

<div class="flex flex-wrap gap-3">
  <FormField
    {form}
    name="data.duration_minutes"
    description="How long the walk was"
  >
    {#snippet children(props)}
      <FormControl {...props} label="Duration in minutes (optional)">
        {#snippet children({ props })}
          <Input
            {...props}
            min="1"
            type="number"
            class="w-fit"
            bind:value={
              () =>
                $form_data.data.kind === "walk"
                  ? $form_data.data.duration_minutes
                  : 0,
              (value) =>
                $form_data.data.kind === "walk" &&
                ($form_data.data.duration_minutes = value || undefined)
            }
          />
        {/snippet}
      </FormControl>
    {/snippet}
  </FormField>

  <FormField
    {form}
    name="data.distance_meters"
    description="How far the walk was"
  >
    {#snippet children(props)}
      <FormControl {...props} label="Distance in meters (optional)">
        {#snippet children({ props })}
          <Input
            {...props}
            min="1"
            type="number"
            class="w-fit"
            bind:value={
              () =>
                $form_data.data.kind === "walk"
                  ? $form_data.data.distance_meters
                  : 0,
              (value) =>
                $form_data.data.kind === "walk" &&
                ($form_data.data.distance_meters = value || undefined)
            }
          />
        {/snippet}
      </FormControl>
    {/snippet}
  </FormField>
</div>
