<script lang="ts">
  import Picture from "$lib/components/images/Picture.svelte";
  import * as Card from "$lib/components/ui/card/index.js";
  import { IMAGES } from "$lib/const/image.const";
  import { STYLES } from "$lib/const/styles.const";
  import { cn } from "$lib/utils/shadcn.util";
  import { Strings } from "$lib/utils/strings.util";
  import type { ComponentProps, Snippet } from "svelte";
  import type { ClassValue } from "svelte/elements";

  let {
    title,
    picture,
    description,
    class: klass,

    content,
    actions,
  }: {
    class?: ClassValue;
    title?: string | Snippet;
    description?: string | null;
    picture?: ComponentProps<typeof Picture>;

    content: Snippet;
    actions?: Snippet;
  } = $props();
</script>

<Card.Root class={cn(STYLES.CARD.SIZE, klass)}>
  {#if picture}
    <Picture
      {...picture}
      aspectRatio={16 / 9}
      class="w-full rounded-b-none border-b object-cover"
      height={IMAGES.SIZES.THUMBNAIL.height}
    />
  {/if}

  {#if title || description}
    <Card.Header>
      {#if title}
        <Card.Title>
          {#if typeof title === "string"}
            {title}
          {:else}
            {@render title()}
          {/if}
        </Card.Title>
      {/if}

      {#if description}
        <Card.Description>
          {Strings.ellipsify(description, 150)}
        </Card.Description>
      {/if}
    </Card.Header>
  {/if}

  <Card.Content>
    {@render content()}
  </Card.Content>

  {#if actions}
    <Card.Footer>
      {@render actions?.()}
    </Card.Footer>
  {/if}
</Card.Root>
