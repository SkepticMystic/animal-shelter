<script lang="ts">
  import * as Item from "$lib/components/ui/item/index.js";
  import ExtractSnippet from "$lib/components/util/ExtractSnippet.svelte";
  import type { MaybeSnippet } from "$lib/interfaces/svelte.types";
  import type { ComponentProps, Snippet } from "svelte";
  import Icon from "../icon/Icon.svelte";

  let {
    icon,
    header,
    media,
    title,
    description,
    footer,
    actions,
    ...rest
  }: ComponentProps<typeof Item.Root> & {
    icon?: string;
    media?: Snippet;
    header?: MaybeSnippet;
    title?: MaybeSnippet;
    description?: MaybeSnippet;
    footer?: MaybeSnippet;
    actions?: Snippet;
  } = $props();
</script>

<Item.Root {...rest}>
  {#if header}
    <Item.Header>
      <ExtractSnippet snippet={header} />
    </Item.Header>
  {/if}

  {#if icon}
    <Item.Media variant="icon">
      <Icon {icon} />
    </Item.Media>
  {:else if media}
    <Item.Media>{@render media()}</Item.Media>
  {/if}

  <Item.Content>
    {#if title}
      <Item.Title>
        <ExtractSnippet snippet={title} />
      </Item.Title>
    {/if}

    {#if description}
      <Item.Description>
        <ExtractSnippet snippet={description} />
      </Item.Description>
    {/if}
  </Item.Content>

  {#if actions}
    <Item.Actions>
      {@render actions()}
    </Item.Actions>
  {/if}

  {#if footer}
    <Item.Footer>
      <ExtractSnippet snippet={footer} />
    </Item.Footer>
  {/if}
</Item.Root>
