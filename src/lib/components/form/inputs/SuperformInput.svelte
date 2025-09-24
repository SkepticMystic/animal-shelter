<script lang="ts" module>
  type T = Record<string, unknown>;
</script>

<script lang="ts" generics="T extends Record<string, unknown>">
  import Input from "$lib/components/ui/input/input.svelte";
  import { untrack } from "svelte";
  import type { HTMLInputAttributes } from "svelte/elements";
  import {
    fieldProxy,
    type FormPathLeaves,
    type SuperForm,
  } from "sveltekit-superforms";

  let {
    form,
    name,
    ...rest
  }: Omit<HTMLInputAttributes, "name" | "form"> & {
    form: SuperForm<T>;
    // Not having `| string` would be nice
    // But in practice, we get the `name` prop from the wrapping Control
    // and it doesn't narrow the name type
    // But, the control gets its name prop from the wrapping Field, and we do type that
    name: string | FormPathLeaves<T>;
  } = $props();

  const value = $derived(
    fieldProxy(
      untrack(() => form),
      name as FormPathLeaves<T>,
    ),
  );
  $inspect(name, $value);
</script>

<Input {...rest} {name} bind:value={$value} />
