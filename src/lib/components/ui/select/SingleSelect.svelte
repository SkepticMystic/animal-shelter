<script lang="ts" generics="V extends string">
  import * as Select from "$lib/components/ui/select/index.js";
  import type { MaybePromise, SelectOption } from "$lib/interfaces";
  import { cn } from "$lib/utils/shadcn.util";
  import type { SelectRootProps } from "bits-ui";
  import type { ClassValue } from "svelte/elements";

  let {
    options,
    loading,
    disabled,
    on_value_select,
    value = $bindable(),
    placeholder = "Select an option",
    ...rest
  }: Omit<SelectRootProps, "type" | "value" | "onValueChange"> & {
    value?: V;
    loading?: boolean;
    class?: ClassValue;
    placeholder?: string;
    options: SelectOption<V>[];
    on_value_select?: (value: V) => MaybePromise<unknown>;
  } = $props();

  let selected = $derived(options.find((i) => i.value === value));
</script>

<Select.Root
  loop
  {value}
  type="single"
  items={options}
  disabled={disabled || loading}
  onValueChange={async (e) => {
    value = e as V;

    loading = true;
    await on_value_select?.(value);
    loading = false;
  }}
  {...rest}
>
  <Select.Trigger {loading} class={cn("w-fit max-w-[200-px]", rest.class)}>
    <span class="truncate"> {selected?.label ?? placeholder}</span>
  </Select.Trigger>

  <Select.Content>
    {#each options as option (option.value)}
      <Select.Item value={option.value} label={option.label} />
    {/each}
  </Select.Content>
</Select.Root>
