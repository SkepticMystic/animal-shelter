<script lang="ts">
  import { SHARE } from "$lib/const/share.const";
  import { Share } from "$lib/utils/share/share.util";
  import type { Snippet } from "svelte";
  import Button from "../ui/button/button.svelte";

  let {
    data,
    social_id,
    children,
  }: {
    data: ShareData;
    social_id: (typeof SHARE.SOCIAL.IDS)[number];
    children?: Snippet;
  } = $props();

  const platform = SHARE.SOCIAL.MAP[social_id];
</script>

<Button
  {children}
  target="_blank"
  variant="outline"
  icon={platform.icon}
  title="Share on {platform.label}"
  href={Share.build_social_url[social_id](data).toString()}
/>
