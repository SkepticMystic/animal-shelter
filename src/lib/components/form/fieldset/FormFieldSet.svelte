<script
  lang="ts"
  generics="T extends Record<string, unknown>, U extends FormPath<T>"
>
  import FormDescription from "$lib/components/ui/form/form-description.svelte";
  import FormFieldErrors from "$lib/components/ui/form/form-field-errors.svelte";
  import FormFieldset from "$lib/components/ui/form/form-fieldset.svelte";
  import FormLegend from "$lib/components/ui/form/form-legend.svelte";
  import { cn } from "$lib/utils/shadcn.util";
  import type { ComponentProps } from "svelte";
  import type { FormPath } from "sveltekit-superforms";

  let {
    form,
    name,
    legend,
    description,
    class: klass,
    children: control_children,
    ...rest_props
  }: ComponentProps<typeof FormFieldset<T, U>> & {
    legend?: string;
    description?: string;
  } = $props();
</script>

<FormFieldset
  {form}
  {name}
  class={cn("space-y-3 rounded-md border px-3 pb-2", klass)}
  {...rest_props}
>
  {#snippet children(control_props)}
    {#if legend}
      <FormLegend>{legend}</FormLegend>
    {/if}

    {#if description}
      <FormDescription>{description}</FormDescription>
    {/if}

    {@render control_children?.(control_props)}

    <FormFieldErrors />
  {/snippet}
</FormFieldset>
