<script lang="ts">
  import { ICONS } from "$lib/const/icon.const";
  import { Share } from "$lib/utils/share/share.util";
  import type { Snippet } from "svelte";
  import Button from "../ui/button/button.svelte";

  let { data, children }: { data: ShareData; children?: Snippet } = $props();
</script>

<Button
  {children}
  variant="outline"
  icon={ICONS.SHARE}
  onclick={() => Share.native(data)}
/>
