<script lang="ts" generics="TData extends Item">
  import type { ResolvedPathname } from "$app/types";
  import { Button } from "$lib/components/ui/button/index.js";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
  import Icon from "$lib/components/ui/icon/Icon.svelte";
  import type { MaybePromise } from "$lib/interfaces";
  import type { Item } from "$lib/utils/items.util";
  import { cn } from "$lib/utils/shadcn.util";
  import type { Row } from "@tanstack/table-core";
  import type { DropdownMenuItemPropsWithoutHTML } from "bits-ui";
  import type { ClassValue } from "svelte/elements";

  type Action =
    | {
        kind: "separator";
      }
    | {
        kind: "group";
        label: string;
        actions: Action[];
      }
    | ({
        kind: "item";
        title: string | ((row: Row<TData>) => string);
        icon?: ClassValue | ((row: Row<TData>) => ClassValue);
        variant?: "default" | "destructive";

        hide?: (row: Row<TData>) => boolean;
        disabled?: (row: Row<TData>) => boolean;

        href?: (row: Row<TData>) => ResolvedPathname;
        onselect?: (row: Row<TData>) => MaybePromise<unknown>;
      } & Omit<DropdownMenuItemPropsWithoutHTML, "onSelect" | "disabled">);

  let {
    row,
    actions,
    loading,
  }: {
    row: Row<TData>;
    actions: Action[];
    loading?: boolean;
  } = $props();
</script>

{#snippet action_snippet(action: Action, row: Row<TData>)}
  {#if action.kind === "separator"}
    <DropdownMenu.Separator />
  {:else if action.kind === "item"}
    {@const {
      icon,
      title,
      href,
      hide,
      disabled,
      onselect,
      // NOTE: Don't pass variant to Button (href)
      // Links will usually be ghost anyway, and DropdownMenu.Item doesn't allow ghost variant
      variant,
      kind: _kind,
      ...rest
    } = action}

    {#snippet item_children()}
      <Icon icon={typeof icon === "function" ? icon(row) : icon} />

      {typeof title === "function" ? title(row) : title}
    {/snippet}

    {#if !hide || !hide(row)}
      {#if href}
        <Button
          {...rest}
          variant="ghost"
          href={href(row)}
          data-slot="dropdown-menu-item"
          class={cn(
            // Copy pasted from DropdownMenu.Item class
            "relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 data-[variant=destructive]:text-destructive data-[variant=destructive]:data-highlighted:bg-destructive/10 data-[variant=destructive]:data-highlighted:text-destructive dark:data-[variant=destructive]:data-highlighted:bg-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground data-[variant=destructive]:*:[svg]:!text-destructive",
            // Added by me to replicate DropdownMenu.Item layout
            "justify-start",
          )}
        >
          {@render item_children()}
        </Button>
      {:else}
        <DropdownMenu.Item
          {...rest}
          {variant}
          disabled={disabled?.(row)}
          onSelect={async () => {
            if (onselect) {
              loading = true;
              await onselect(row);
              loading = false;
            }
          }}
        >
          {@render item_children()}
        </DropdownMenu.Item>
      {/if}
    {/if}
  {:else if action.kind === "group"}
    <DropdownMenu.Group>
      <DropdownMenu.Label>{action.label}</DropdownMenu.Label>

      {#each action.actions as subaction, i (i)}
        {@render action_snippet(subaction, row)}
      {/each}
    </DropdownMenu.Group>
  {/if}
{/snippet}

<DropdownMenu.Root>
  <DropdownMenu.Trigger>
    {#snippet child({ props })}
      <Button
        {...props}
        {loading}
        variant="ghost"
        icon="lucide/ellipsis"
        class="relative size-8 p-0"
      />
    {/snippet}
  </DropdownMenu.Trigger>

  <DropdownMenu.Content align="end">
    {#each actions as action, i (i)}
      {@render action_snippet(action, row)}
    {/each}
  </DropdownMenu.Content>
</DropdownMenu.Root>
