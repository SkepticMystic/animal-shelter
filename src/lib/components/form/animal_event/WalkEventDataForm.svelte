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

<div class="flex flex-wrap gap-3">
  <FormFieldControl
    {form}
    name="data.duration_minutes"
    description="How long the walk was"
    label="Duration in minutes (optional)"
  >
    {#snippet children({ props })}
      <Input
        {...props}
        min="1"
        type="number"
        class="w-fit"
        icon="lucide/clock"
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
  </FormFieldControl>

  <FormFieldControl
    {form}
    name="data.distance_meters"
    description="How far the walk was"
    label="Distance in meters (optional)"
  >
    {#snippet children({ props })}
      <Input
        {...props}
        min="1"
        type="number"
        class="w-fit"
        icon="lucide/map-pin"
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
  </FormFieldControl>
</div>
