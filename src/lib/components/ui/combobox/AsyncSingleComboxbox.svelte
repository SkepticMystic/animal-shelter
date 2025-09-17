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
  import { debounce } from "ts-debounce";
  import Icon from "../icon/Icon.svelte";
  import Input from "../input/input.svelte";
  import Loading from "../loading/Loading.svelte";

  let {
    search,
    open = false,
    disabled = false,
    value = $bindable(),
    placeholder = "Search for an option...",
  }: {
    value?: V;
    open?: boolean;
    disabled?: boolean;
    placeholder?: string;
    search: (query: string) => Promise<SelectOption<V, D>[]>;
  } = $props();

  let query = $state("");
  let loading = $state(false);
  let options: Awaited<ReturnType<typeof search>> = $state([]);
  let selected = $derived(options.find((o) => o.value === value));

  const search_inner = async () => {
    console.log(`Searching for "${$state.snapshot(query)}"...`);
    loading = true;

    try {
      options = await search(query);
    } catch (error) {
      console.error("Error searching for options:", error);
      options = [];
    }

    loading = false;
  };

  const debounced = debounce(search_inner, 300);

  if (value) {
    disabled = true;
    // If we have an initial value, search for it to get the label
    search_inner();
  }

  let trigger_ref = $state<HTMLButtonElement>(null!);
  // We want to refocus the trigger button when the user selects
  // an item from the list so users can continue navigating the
  // rest of the form with the keyboard.
  function close_and_focus_trigger() {
    open = false;
    tick().then(() => trigger_ref.focus());
  }
</script>

<Popover.Root
  bind:open
  onOpenChange={(opening) => opening && !options.length && search_inner()}
>
  <Popover.Trigger {disabled} bind:ref={trigger_ref}>
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

        <Loading {loading} class="ml-2 size-4 shrink-0 opacity-50">
          <Icon
            icon="lucide/chevrons-up-down"
            class="ml-2 size-4 shrink-0 opacity-50"
          />
        </Loading>
      </Button>
    {/snippet}
  </Popover.Trigger>

  <Popover.Content class="w-[200px] p-0">
    <Command.Root>
      <div
        class="flex h-9 items-center gap-2 border-b pl-2"
        data-slot="command-input-wrapper"
      >
        <Icon icon="lucide/search" class="size-4 shrink-0 opacity-50" />

        <Input
          data-slot="command-input"
          class={cn(
            "flex w-full rounded-md border-none bg-transparent py-3 text-sm outline-hidden placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
            "shadow-none ring-0 focus-visible:ring-0 focus-visible:ring-offset-0",
          )}
          value={query}
          oninput={(e) => {
            query = e.currentTarget.value;
            debounced();
          }}
        />
      </div>

      <Command.List>
        <Command.Empty>
          {#if loading}
            Loading...
          {:else if query}
            No results for "{query}"
          {:else}
            No options found
          {/if}
        </Command.Empty>

        <Command.Group>
          {#each options as option}
            <Command.Item
              value={option.value}
              onSelect={() => {
                value = option.value;

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
