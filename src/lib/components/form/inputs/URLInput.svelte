<script lang="ts">
  import Input from "$lib/components/ui/input/input.svelte";
  import type { ComponentProps } from "svelte";

  let {
    value = $bindable(),
    ...rest
  }: Omit<ComponentProps<typeof Input>, "value" | "files"> & {
    value?: string;
  } = $props();
</script>

<Input
  inputmode="url"
  autocomplete="url"
  placeholder="https://example.com"
  {...rest}
  bind:value
/>
