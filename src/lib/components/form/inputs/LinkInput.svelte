<script lang="ts">
  import Button from "$lib/components/ui/button/button.svelte";
  import FormElementField from "$lib/components/ui/form/form-element-field.svelte";
  import Icon from "$lib/components/ui/icon/Icon.svelte";
  import Input from "$lib/components/ui/input/input.svelte";
  import { ICONS } from "$lib/const/icon.const";
  import type { ILink } from "$lib/const/link.const";
  import type { Link } from "$lib/schema/link.schema";
  import { LinkUtil } from "$lib/utils/link/link.util";
  import { cn } from "$lib/utils/shadcn.util";
  import type { FsSuperForm } from "formsnap";
  import FormControl from "../controls/FormControl.svelte";
  import EmailInput from "./EmailInput.svelte";
  import TelInput from "./TelInput.svelte";
  import UrlInput from "./URLInput.svelte";

  let {
    form,
    name,
    kind,
    on_remove,
    link = $bindable(),
  }: {
    link: Link;
    name: string;
    kind: ILink.KindId;
    form: FsSuperForm<any>;
    on_remove?: () => void;
  } = $props();

  const get_href = () => LinkUtil.format_href(link);
  const set_href = (value: string) => (link.href = value);
</script>

<div class="flex flex-col gap-0.5 sm:flex-row">
  <!-- If the superForm has type: 'json', the name field doesn't matter
   As long as the input is manipulating the right field -->
  <FormElementField {form} name="{name}.href">
    <FormControl label="">
      {#snippet children({ props })}
        {#if kind === "https"}
          <!-- NOTE: Don't add type="url"
           We are more lenient on input than it allows -->
          <UrlInput {...props} bind:value={get_href, set_href} />
        {:else if kind === "tel"}
          <TelInput {...props} bind:value={get_href, set_href} />
        {:else if kind === "mailto"}
          <EmailInput {...props} bind:value={get_href, set_href} />
        {/if}
      {/snippet}
    </FormControl>
  </FormElementField>

  <div class="flex gap-0.5">
    <FormElementField {form} name="{name}.label" class="flex-1">
      <FormControl label="">
        {#snippet children({ props })}
          <div class="relative">
            <!-- I managed to get the fancy expanding label input working, mostly
             But it didn't feel good in the end -->
            <!-- class="not-placeholder-shown:pr-7 placeholder-shown:w-8 placeholder-shown:placeholder-transparent focus:w-full focus:pr-7 focus:placeholder-muted-foreground" -->
            <Input
              placeholder="Label (optional)"
              {...props}
              class={cn("pr-7")}
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
      variant="outline"
      title="Remove"
      icon={ICONS.CLOSE}
      onclick={() => on_remove?.()}
    />
  </div>
</div>
