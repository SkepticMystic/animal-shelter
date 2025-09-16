<script lang="ts">
  import Input from "$lib/components/ui/input/input.svelte";
  import parse_phone_number from "libphonenumber-js";
  import type { ComponentProps } from "svelte";

  let {
    value = $bindable(),
    ...rest
  }: Omit<ComponentProps<typeof Input>, "type" | "value" | "files"> & {
    value?: string;
  } = $props();
</script>

<Input
  type="tel"
  inputmode="tel"
  autocomplete="tel"
  placeholder="011 234 5678"
  value={value ? parse_phone_number(value, "ZA")?.formatNational() : value}
  oninput={(e) => (value = e.currentTarget.value)}
  {...rest}
/>
