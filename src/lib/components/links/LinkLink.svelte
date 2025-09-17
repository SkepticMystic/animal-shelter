<script lang="ts">
  import type { Link } from "$lib/schema/link.schema";
  import { LinkUtil } from "$lib/utils/link/link.util";
  import type { HTMLAnchorAttributes } from "svelte/elements";
  import EmailLink from "./EmailLink.svelte";
  import ExternalLink from "./ExternalLink.svelte";
  import TelLink from "./TelLink.svelte";

  let {
    link,
    favicon = true,
    ...rest
  }: HTMLAnchorAttributes & {
    link: Link;
    favicon?: boolean;
  } = $props();

  const link_kind = LinkUtil.get_kind(link);
</script>

{#if link_kind === "https"}
  <ExternalLink {link} {favicon} {...rest} />
{:else if link_kind === "tel"}
  <TelLink {link} {...rest} />
{:else if link_kind === "mailto"}
  <EmailLink {link} {...rest} />
{/if}
