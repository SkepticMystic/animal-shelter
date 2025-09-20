<script lang="ts">
  import { LINKS } from "$lib/const/link.const";
  import type { Link } from "$lib/schema/link.schema";
  import { LinkUtil } from "$lib/utils/link/link.util";
  import type { HTMLAnchorAttributes } from "svelte/elements";
  import Anchor from "../ui/anchor/Anchor.svelte";

  let {
    link,
    ...rest
  }: HTMLAnchorAttributes & {
    link: Link;
  } = $props();

  const label = $derived(link.label || LinkUtil.format_href(link));
</script>

<Anchor
  {...rest}
  href={link.href}
  title="Email {label}"
  icon={LINKS.KIND.MAP["mailto"].icon}
>
  {label}
</Anchor>
