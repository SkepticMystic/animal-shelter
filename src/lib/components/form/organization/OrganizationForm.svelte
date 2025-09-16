<script lang="ts">
  import FormButton from "$lib/components/ui/form/form-button.svelte";
  import Input from "$lib/components/ui/input/input.svelte";
  import type { MaybePromise } from "$lib/interfaces";
  import type { OrganizationSchema } from "$lib/server/db/schema/auth.model";
  import { make_super_form, type APIResult } from "$lib/utils/form.util";
  import type { Organization } from "better-auth/plugins";
  import type { SuperValidated } from "sveltekit-superforms";
  import FormControl from "../controls/FormControl.svelte";
  import FormField from "../fields/FormField.svelte";
  import FormMessage from "../FormMessage.svelte";

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

  const { form: form_data } = form;
</script>

<form class="flex flex-col gap-2" method="POST" use:form.enhance>
  <FormField {form} name="name" description="The name of the shelter">
    <FormControl label="Name">
      {#snippet children({ props })}
        <Input
          {...props}
          required
          placeholder="Name"
          bind:value={$form_data.name}
        />
      {/snippet}
    </FormControl>
  </FormField>

  <FormField {form} name="logo" description="A link to the logo of the shelter">
    <FormControl label="Logo (optional)">
      {#snippet children({ props })}
        <Input
          {...props}
          placeholder="https://example.com/logo.png"
          bind:value={$form_data.logo}
        />
      {/snippet}
    </FormControl>
  </FormField>

  <FormButton {form} class="w-full" icon="lucide/send">Submit</FormButton>

  <FormMessage {form} />
</form>
