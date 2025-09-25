<script lang="ts">
  import type { ResolvedPathname } from "$app/types";
  import { ICONS } from "$lib/const/icon.const";
  import Button from "../ui/button/button.svelte";

  let {
    href,
  }: {
    href?: ResolvedPathname;
  } = $props();
</script>

<Button
  href={href ?? "."}
  variant="outline"
  icon={ICONS.BACK}
  title="Go back"
/>
