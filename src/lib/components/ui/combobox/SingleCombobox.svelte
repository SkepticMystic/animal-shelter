<script
  lang="ts"
  generics="V extends string, D extends unknown | undefined = undefined"
>
  import { Button } from "$lib/components/ui/button/index.js";
  import * as Command from "$lib/components/ui/command/index.js";
  import * as Popover from "$lib/components/ui/popover/index.js";
  import type { SelectOption } from "$lib/interfaces";
  import { cn } from "$lib/utils/shadcn.util";
  import { tick } from "svelte";
  import type { ClassValue } from "svelte/elements";
  import Icon from "../icon/Icon.svelte";

  let {
    options,
    open = false,
    on_value_change,
    value = $bindable(),
    placeholder = "Select an option...",
  }: {
    open?: boolean;
    placeholder?: string;
    value: V | null | undefined;
    options: SelectOption<V, D>[];
    on_value_change?: (value: V) => void;
  } = $props();

  let selected = $derived(options.find((f) => f.value === value));

  let trigger_ref = $state<HTMLButtonElement>(null!);
  // We want to refocus the trigger button when the user selects
  // an item from the list so users can continue navigating the
  // rest of the form with the keyboard.
  function close_and_focus_trigger() {
    open = false;
    tick().then(() => trigger_ref.focus());
  }
</script>

<Popover.Root bind:open>
  <Popover.Trigger bind:ref={trigger_ref}>
    {#snippet child({ props })}
      <Button
        variant="outline"
        {...props}
        class={cn(props.class as ClassValue, "w-[200px] justify-between")}
        role="combobox"
        aria-expanded={open}
      >
        <span class="truncate">
          {selected?.label || placeholder}
        </span>

        <Icon
          icon="lucide/chevrons-up-down"
          class="ml-2 size-4 shrink-0 opacity-50"
        />
      </Button>
    {/snippet}
  </Popover.Trigger>

  <Popover.Content class="w-[200px] p-0">
    <Command.Root>
      <Command.Input {placeholder} />

      <Command.List>
        <Command.Empty>No options found</Command.Empty>

        <Command.Group>
          {#each options as option (option.value)}
            <Command.Item
              value={option.value}
              onSelect={() => {
                value = option.value;

                on_value_change?.(value);
                close_and_focus_trigger();
              }}
            >
              <Icon
                icon="lucide/check"
                class={cn(
                  "mr-2 size-4",
                  value !== option.value && "text-transparent",
                )}
              />

              {option.label}
            </Command.Item>
          {/each}
        </Command.Group>
      </Command.List>
    </Command.Root>
  </Popover.Content>
</Popover.Root>
