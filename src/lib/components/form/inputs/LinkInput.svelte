<script lang="ts">
  import Button from "$lib/components/ui/button/button.svelte";
  import FormElementField from "$lib/components/ui/form/form-element-field.svelte";
  import Icon from "$lib/components/ui/icon/Icon.svelte";
  import Input from "$lib/components/ui/input/input.svelte";
  import { ICONS } from "$lib/const/icon.const";
  import type { Link } from "$lib/schema/link.schema";
  import { cn } from "$lib/utils/shadcn.util";
  import type { ControlAttrs, FsSuperForm } from "formsnap";
  import type { ComponentProps, Snippet } from "svelte";
  import FormControl from "../controls/FormControl.svelte";

  let {
    form,
    name,
    on_remove,
    href_input,
    label_input,
    link = $bindable(),
  }: {
    link: Link;
    name: string;
    form: FsSuperForm<any>;
    on_remove?: () => void;
    label_input?: ComponentProps<typeof Input>;
    href_input: Snippet<[{ props: ControlAttrs }]>;
  } = $props();
</script>

<div class="flex gap-0.5">
  <!-- If the superForm has type: 'json', the name field doesn't matter
   As long as the input is manipulating the right field -->
  <FormElementField {form} name="{name}.href">
    <FormControl label="">
      {#snippet children({ props })}
        {@render href_input({ props })}
      {/snippet}
    </FormControl>
  </FormElementField>

  <FormElementField {form} name="{name}.label">
    <FormControl label="">
      {#snippet children({ props })}
        <div class="relative">
          <!-- I managed to get the fancy expanding label input working, mostly
           But it didn't feel good in the end -->
          <!-- class="not-placeholder-shown:pr-7 placeholder-shown:w-8 placeholder-shown:placeholder-transparent focus:w-full focus:pr-7 focus:placeholder-muted-foreground" -->
          <Input
            placeholder="Label (optional)"
            {...props}
            {...label_input}
            class={cn("pr-7", label_input?.class)}
            bind:value={link.label}
          />

          <Icon
            icon="lucide/tag"
            class="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 opacity-60"
          />
        </div>
      {/snippet}
    </FormControl>
  </FormElementField>

  <Button
    type="button"
    variant="ghost"
    title="Remove"
    icon={ICONS.CLOSE}
    onclick={() => on_remove?.()}
  />
</div>
