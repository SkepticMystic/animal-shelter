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
</script>

<Anchor
  {...rest}
  href={link.href}
  title="Send an email"
  icon={LINKS.KIND.MAP["mailto"].icon}
>
  {link.label || LinkUtil.format_href(link)}
</Anchor>
