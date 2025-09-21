<script lang="ts">
  import FormFieldset from "$lib/components/form/fields/FormFieldSet.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import { LINKS, type ILink } from "$lib/const/link.const";
  import type { Link } from "$lib/schema/link.schema";
  import type { FsSuperForm } from "formsnap";
  import LinkInput from "../inputs/LinkInput.svelte";

  let {
    form,
    name,
    kind,
    legend,
    description,
    links = $bindable(),
  }: {
    name: string;
    links: Link[];
    kind: ILink.KindId;
    form: FsSuperForm<any>;
    legend?: string;
    description?: string;
  } = $props();

  const actions = {
    add: () => {
      links = [
        ...links,
        {
          href: "",
          label: "",
          id: crypto.randomUUID().split("-")[0],
        },
      ];
    },

    remove: (link_id: string) => {
      links = links.filter((link) => link.id !== link_id);
    },
  };
</script>

<FormFieldset
  {form}
  {name}
  {legend}
  {description}
  class="space-y-3 rounded-md border px-3 pb-2"
>
  <div class="grid gap-3 sm:grid-cols-2">
    {#each links as link, link_i (link.id)}
      <LinkInput
        {form}
        {kind}
        name="{name}[{link_i}]"
        on_remove={() => actions.remove(link.id)}
        bind:link={links[link_i]}
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
