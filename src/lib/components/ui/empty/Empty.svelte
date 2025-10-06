<script lang="ts" module>
  import * as Empty from "$lib/components/ui/empty/index.js";
  import type { MaybeSnippet } from "$lib/interfaces/svelte.types";
  import type { ComponentProps, Snippet } from "svelte";

  export type EmptyProps = ComponentProps<typeof Empty.Root> & {
    media?: Snippet;
    icon?: string;
    title?: MaybeSnippet;
    content?: MaybeSnippet;
    description?: MaybeSnippet;
  };
</script>

<script lang="ts">
  import ExtractSnippet from "$lib/components/util/ExtractSnippet.svelte";
  import Icon from "../icon/Icon.svelte";

  let { icon, title, media, content, description, ...props }: EmptyProps =
    $props();
</script>

<Empty.Root {...props}>
  <Empty.Header>
    {#if media}
      <Empty.Media>
        {@render media()}
      </Empty.Media>
    {:else if icon}
      <Empty.Media variant="icon">
        <Icon {icon} />
      </Empty.Media>
    {/if}

    {#if title}
      <Empty.Title>
        <ExtractSnippet snippet={title} />
      </Empty.Title>
    {/if}

    {#if description}
      <Empty.Description>
        <ExtractSnippet snippet={description} />
      </Empty.Description>
    {/if}
  </Empty.Header>

  {#if content}
    <Empty.Content>
      <ExtractSnippet snippet={content} />
    </Empty.Content>
  {/if}
</Empty.Root>
