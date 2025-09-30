<script lang="ts" generics="T extends Record<string, unknown>">
  import Button from "$lib/components/ui/button/button.svelte";
  import { ICONS } from "$lib/const/icon.const";
  import type { ILink } from "$lib/const/link.const";
  import type { Link } from "$lib/schema/link.schema";
  import { LinkUtil } from "$lib/utils/link/link.util";
  import { untrack } from "svelte";
  import {
    fieldProxy,
    type FieldProxy,
    type FormPath,
    type FormPathLeaves,
    type SuperForm,
  } from "sveltekit-superforms";
  import FormFieldControl from "../fields/FormFieldControl.svelte";
  import EmailInput from "./EmailInput.svelte";
  import SuperformInput from "./SuperformInput.svelte";
  import TelInput from "./TelInput.svelte";
  import UrlInput from "./URLInput.svelte";

  type V = Link;

  let {
    form,
    name,
    kind,
    on_remove,
  }: {
    kind: ILink.KindId;
    form: SuperForm<T>;
    name: FormPath<T, V>;
    on_remove?: () => void;
  } = $props();

  const link = $derived(
    fieldProxy(
      untrack(() => form),
      name,
    ) satisfies FieldProxy<V>,
  );

  const get_leaf_name = <F extends keyof V>(field: F) =>
    `${name}.${field}` as FormPathLeaves<T, V[F]>;

  const get_href = () => LinkUtil.format_href($link);
  const set_href = (value: string) => ($link.href = value);
</script>

<div class="flex flex-col gap-0.5 sm:flex-row">
  <!-- If the superForm has type: 'json', the name field doesn't matter
   As long as the input is manipulating the right field -->
  <FormFieldControl {form} name={get_leaf_name("href")} label="">
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
  </FormFieldControl>

  <div class="flex gap-0.5">
    <FormFieldControl
      {form}
      name={get_leaf_name("label")}
      class="flex-1"
      label=""
    >
      {#snippet children({ props })}
        <!-- I managed to get the fancy expanding label input working, mostly
               But it didn't feel good in the end -->
        <!-- class="not-placeholder-shown:pr-7 placeholder-shown:w-8 placeholder-shown:placeholder-transparent focus:w-full focus:pr-7 focus:placeholder-muted-foreground" -->
        <SuperformInput
          {...props}
          {form}
          icon="lucide/tag"
          placeholder="Label (optional)"
        />
      {/snippet}
    </FormFieldControl>

    <Button
      type="button"
      variant="outline"
      title="Remove"
      icon={ICONS.CLOSE}
      onclick={() => on_remove?.()}
    />
  </div>
</div>
