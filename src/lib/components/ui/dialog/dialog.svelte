<script lang="ts">
  import {
    buttonVariants,
    type ButtonProps,
  } from "$lib/components/ui/button/index.js";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import type { DialogRootProps } from "bits-ui";
  import type { Snippet } from "svelte";
  import type { ClassValue } from "svelte/elements";
  import Icon from "../icon/Icon.svelte";
  import ScrollArea from "../scroll-area/scroll-area.svelte";

  let {
    open,
    size,
    icon,
    title,
    disabled,
    description,
    variant = "default",
    trigger,
    actions,
    content,

    ...rest_props
  }: DialogRootProps & {
    title?: string;
    disabled?: boolean;
    description?: string;
    size?: ButtonProps["size"];
    variant?: ButtonProps["variant"];

    icon?: string;
    trigger?: Snippet;
    content: Snippet<[{ close: typeof close }]>;
    actions?: Snippet<[{ close: typeof close }]>;
  } = $props();

  const close = () => {
    open = false;
  };

  if (icon && !trigger && !size) {
    size = "icon";
  }
</script>

<Dialog.Root {...rest_props} {open}>
  <Dialog.Trigger
    {title}
    {disabled}
    type="button"
    class={buttonVariants({ variant, size })}
  >
    {#if trigger}
      {@render trigger()}
    {:else if icon}
      <Icon {icon} />
    {/if}
  </Dialog.Trigger>

  <Dialog.Content class="sm:max-w-[425px]">
    {#if title || description}
      <Dialog.Header>
        {#if title}
          <Dialog.Title>{title}</Dialog.Title>
        {/if}

        {#if description}
          <Dialog.Description>
            {description}
          </Dialog.Description>
        {/if}
      </Dialog.Header>
    {/if}

    <ScrollArea class="max-h-[75vh] w-full">
      {@render content({ close })}
    </ScrollArea>

    {#if actions}
      <Dialog.Footer>
        {@render actions?.({ close })}
      </Dialog.Footer>
    {/if}
  </Dialog.Content>
</Dialog.Root>
