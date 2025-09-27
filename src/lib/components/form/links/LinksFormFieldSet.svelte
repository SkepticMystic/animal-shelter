<script lang="ts" generics="T extends Record<string, unknown>">
  import FormFieldset from "$lib/components/form/fieldset/FormFieldSet.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import { LINKS, type ILink } from "$lib/const/link.const";
  import type { Link } from "$lib/schema/link.schema";
  import { untrack } from "svelte";
  import {
    arrayProxy,
    type ArrayProxy,
    type FormPath,
    type FormPathArrays,
    type SuperForm,
  } from "sveltekit-superforms";
  import LinkInput from "../inputs/LinkInput.svelte";

  let {
    form,
    name,
    kind,
    legend,
    description,
  }: {
    kind: ILink.KindId;
    legend?: string;
    description?: string;
    form: SuperForm<T>;
    name: FormPathArrays<T, Link[]>;
  } = $props();

  const { values } = $derived(
    arrayProxy(
      untrack(() => form),
      name,
    ) as ArrayProxy<Link>,
  );
  $inspect(name, $values);

  const actions = {
    add: () => {
      $values = [
        ...$values,
        {
          href: "",
          label: "",
          id: crypto.randomUUID().split("-")[0],
        },
      ];
    },

    remove: (id: string) => {
      $values = $values.filter((link) => link.id !== id);
    },
  };
</script>

<FormFieldset {form} {name} {legend} {description}>
  <div class="grid gap-3 sm:grid-cols-2">
    {#each $values as { id }, i (id)}
      <LinkInput
        {form}
        {kind}
        on_remove={() => actions.remove(id)}
        name={`${name}[${i}]` as FormPath<T, Link>}
      />
    {/each}

    <Button
      type="button"
      variant="outline"
      icon={LINKS.KIND.MAP[kind].icon}
      onclick={() => actions.add()}
    >
      Add {LINKS.KIND.MAP[kind].label}
    </Button>
  </div>
</FormFieldset>
