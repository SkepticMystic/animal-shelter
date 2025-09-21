<script lang="ts">
  import { BetterAuthClient } from "$lib/auth-client";
  import AsyncSingleComboxbox from "$lib/components/ui/combobox/AsyncSingleComboxbox.svelte";
  import SingleCombobox from "$lib/components/ui/combobox/SingleCombobox.svelte";
  import NaturalLanguageDatePicker from "$lib/components/ui/date-picker/NaturalLanguageDatePicker.svelte";
  import FormButton from "$lib/components/ui/form/form-button.svelte";
  import Input from "$lib/components/ui/input/input.svelte";
  import Loading from "$lib/components/ui/loading/Loading.svelte";
  import SingleSelect from "$lib/components/ui/select/SingleSelect.svelte";
  import Textarea from "$lib/components/ui/textarea/textarea.svelte";
  import {
    ANIMAL_EVENTS,
    type IAnimalEvents,
  } from "$lib/const/animal_event.const";
  import type { MaybePromise } from "$lib/interfaces";
  import { get_animals_remote } from "$lib/remote/animal.remote";
  import type {
    AnimalEvent,
    AnimalEventSchema,
  } from "$lib/server/db/schema/animal_event.model";
  import { session } from "$lib/stores/session";
  import { make_super_form, type APIResult } from "$lib/utils/form.util";
  import { Format } from "$lib/utils/format.util";
  import type { SuperValidated } from "sveltekit-superforms";
  import FormControl from "../controls/FormControl.svelte";
  import FormField from "../fields/FormField.svelte";
  import FormMessage from "../FormMessage.svelte";
  import MicrochipEventForm from "./MicrochipEventDataForm.svelte";
  import VaccinationEventDataForm from "./VaccineEventDataForm.svelte";
  import WeighingEventDataForm from "./WeighEventDataForm.svelte";

  type In = AnimalEventSchema.InsertIn;
  type Out = AnimalEventSchema.InsertOut;

  let {
    mode,
    submit,
    on_success,
    form_input,
  }: {
    mode: "insert" | "update";
    form_input: SuperValidated<Out, App.Superforms.Message, In>;

    submit: (data: In) => Promise<APIResult<AnimalEvent>>;
    on_success?: (animal_event: AnimalEvent) => MaybePromise<void>;
  } = $props();

  const form = make_super_form(form_input, { submit, on_success });

  const { form: form_data } = form;

  const on_event_kind_change = (kind: IAnimalEvents.Kind) => {
    $form_data.data = ANIMAL_EVENTS.KINDS.DEFAULT_DATA[kind];
  };
</script>

<form class="space-y-5" method="POST" use:form.enhance>
  <FormField
    {form}
    name="data.kind"
    description={mode === "update"
      ? "Cannot update event type. Rather create a new event"
      : ""}
  >
    <FormControl label="Event type">
      {#snippet children({ props })}
        <SingleSelect
          {...props}
          required
          disabled={mode === "update"}
          options={ANIMAL_EVENTS.KINDS.OPTIONS}
          bind:value={
            () => $form_data.data.kind, (value) => on_event_kind_change(value)
          }
        />
      {/snippet}
    </FormControl>
  </FormField>

  {#if $form_data.data.kind === "weigh"}
    <WeighingEventDataForm {form} />
  {:else if $form_data.data.kind === "vaccine"}
    <VaccinationEventDataForm {form} />
  {:else if $form_data.data.kind === "sterilise"}
    <!--  -->
  {:else if $form_data.data.kind === "microchip"}
    <MicrochipEventForm {form} />
  {/if}

  {#if !form_input.data.animal_id}
    <FormField
      {form}
      name="animal_id"
      description="The animal this event is for"
    >
      <FormControl label="Animal">
        {#snippet children({ props })}
          <!-- NOTE: Huh, something weird about remote functions here...
               Usually I'd just inline all this with a .then to map the result
               But then the remote seems to return undefined... -->
          <AsyncSingleComboxbox
            {...props}
            search={async (query) => {
              const r = await get_animals_remote({ smart: { query } });
              return r.map((a) => ({ value: a.id, label: a.name }));
            }}
            bind:value={$form_data.animal_id}
          />
        {/snippet}
      </FormControl>
    </FormField>
  {/if}

  <div class="flex flex-col gap-2 md:flex-row">
    <FormField
      {form}
      name="administered_by_member_id"
      description="The member who administered the event"
    >
      <FormControl label="Administered by (member)">
        {#snippet children({ props })}
          {#await BetterAuthClient.organization.listMembers()}
            <Loading loading title="Loading members..." />
          {:then members}
            {@const options = members.data
              ? members.data.members.map((m) => ({
                  value: m.id,
                  label:
                    m.user.name +
                    (m.id === $session.data?.session.member_id ? " (you)" : ""),
                }))
              : []}
            <SingleCombobox
              {...props}
              {options}
              bind:value={$form_data.administered_by_member_id}
            />
          {/await}
        {/snippet}
      </FormControl>
    </FormField>

    <FormField
      {form}
      name="administered_by_name"
      description="Or, if not a member, the name of the person"
    >
      <FormControl label="Administered by (name)">
        {#snippet children({ props })}
          <Input {...props} bind:value={$form_data.administered_by_name} />
        {/snippet}
      </FormControl>
    </FormField>
  </div>

  <FormField
    {form}
    name="timestamp"
    description={$form_data.timestamp
      ? Format.date($form_data.timestamp)
      : "Approximate date is fine"}
  >
    <FormControl label="Date">
      {#snippet children({ props })}
        <NaturalLanguageDatePicker
          {...props}
          bind:value={$form_data.timestamp}
        />
      {/snippet}
    </FormControl>
  </FormField>

  <FormField {form} name="notes" description="Any notes about the event">
    <FormControl label="Notes">
      {#snippet children({ props })}
        <Textarea {...props} bind:value={$form_data.notes} />
      {/snippet}
    </FormControl>
  </FormField>

  <FormButton {form} class="w-full" icon="lucide/send">
    {mode === "insert" ? "Add event" : "Update event"}
  </FormButton>

  <FormMessage {form} />
</form>
