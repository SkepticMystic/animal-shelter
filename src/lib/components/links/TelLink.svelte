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
  title="Call this number"
  icon={LINKS.KIND.MAP["tel"].icon}
>
  {link.label || LinkUtil.format_href(link)}
</Anchor>
