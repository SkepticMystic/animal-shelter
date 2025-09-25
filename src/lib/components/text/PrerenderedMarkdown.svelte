<script lang="ts">
  import type { IHTML } from "$lib/utils/html/html.util";
  import { PreRendered } from "carta-md";

  let { html }: { html: IHTML.Prerendered } = $props();
</script>

<PreRendered {html} />
