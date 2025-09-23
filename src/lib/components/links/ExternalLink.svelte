<script lang="ts">
  import { LINKS } from "$lib/const/link.const";
  import type { Link } from "$lib/schema/link.schema";
  import { LinkUtil } from "$lib/utils/link/link.util";
  import { SEOUtil } from "$lib/utils/SEO/SEO.util";
  import type { HTMLAnchorAttributes } from "svelte/elements";
  import Favicon from "../images/Favicon.svelte";
  import Anchor from "../ui/anchor/Anchor.svelte";
  import Icon from "../ui/icon/Icon.svelte";

  let {
    link,
    favicon = true,
    ...rest
  }: HTMLAnchorAttributes & {
    link: Omit<Link, "id">;
    favicon?: boolean;
  } = $props();

  const href = SEOUtil.utmify(link.href, { content: "textlink" });
</script>

<Anchor
  {...rest}
  {href}
  target="_blank"
  rel="noopener noreferrer"
  class="flex w-fit items-center gap-1.5"
>
  {#if favicon}
    <Favicon {href} class="shrink-0">
      {#snippet fallback()}
        <Icon icon={LINKS.KIND.MAP["https"].icon} />
      {/snippet}
    </Favicon>
  {/if}

  <!-- <Iconed reversed icon="lucide/external-link"> -->
  {link.label || LinkUtil.format_href(link, ["hostname"])}
  <!-- </Iconed> -->
</Anchor>
