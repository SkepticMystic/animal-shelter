<script lang="ts">
  import FormButton from "$lib/components/ui/form/form-button.svelte";
  import type { MaybePromise } from "$lib/interfaces";
  import type { OrganizationSchema } from "$lib/server/db/schema/auth.model";
  import { make_super_form, type APIResult } from "$lib/utils/form.util";
  import type { Organization } from "better-auth/plugins";
  import type { SuperValidated } from "sveltekit-superforms";
  import FormFieldControl from "../fields/FormFieldControl.svelte";
  import FormMessage from "../FormMessage.svelte";
  import SuperformInput from "../inputs/SuperformInput.svelte";

  type In = OrganizationSchema.Insert;
  type Out = Organization;

  let {
    submit,
    on_success,
    form_input,
  }: {
    form_input: SuperValidated<In>;
    submit: (data: In) => Promise<APIResult<Out>>;
    on_success?: (out: Out) => MaybePromise<void>;
  } = $props();

  const form = make_super_form(form_input, {
    submit,
    on_success,
  });
</script>

<form class="flex flex-col gap-2" method="POST" use:form.enhance>
  <FormFieldControl
    {form}
    name="name"
    description="The name of the shelter"
    label="Name"
  >
    {#snippet children({ props })}
      <SuperformInput {...props} {form} placeholder="Name" />
    {/snippet}
  </FormFieldControl>

  <FormButton {form} class="w-full" icon="lucide/send">Submit</FormButton>

  <FormMessage {form} />
</form>
