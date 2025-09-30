<script lang="ts">
  import FormFieldControl from "$lib/components/form/fields/FormFieldControl.svelte";
  import FormMessage from "$lib/components/form/FormMessage.svelte";
  import EmailInput from "$lib/components/form/inputs/EmailInput.svelte";
  import SuperformInput from "$lib/components/form/inputs/SuperformInput.svelte";
  import Card from "$lib/components/ui/card/Card.svelte";
  import FormButton from "$lib/components/ui/form/form-button.svelte";
  import Textarea from "$lib/components/ui/textarea/textarea.svelte";
  import { superForm } from "sveltekit-superforms";

  let { data } = $props();

  const form = superForm(data.form_input);
  const form_data = form.form;
</script>

<article class="mx-auto max-w-sm">
  <header>
    <h1>Contact Us</h1>
  </header>

  <Card>
    {#snippet content()}
      <form method="POST" class="space-y-3" use:form.enhance>
        <FormFieldControl {form} name="name" label="Name">
          {#snippet children({ props })}
            <SuperformInput
              {...props}
              {form}
              autocomplete="name"
              placeholder="Your name"
            />
          {/snippet}
        </FormFieldControl>

        <FormFieldControl {form} name="email" label="Email">
          {#snippet children({ props })}
            <EmailInput {...props} required bind:value={$form_data.email} />
          {/snippet}
        </FormFieldControl>

        <FormFieldControl {form} name="message" label="Message">
          {#snippet children({ props })}
            <Textarea
              {...props}
              required
              class="max-h-96 min-h-24"
              placeholder="Your message"
              bind:value={$form_data.message}
            />
          {/snippet}
        </FormFieldControl>

        <FormMessage {form} />

        <FormButton {form} icon="lucide/send" class="w-full">
          Send Message
        </FormButton>
      </form>
    {/snippet}
  </Card>
</article>
