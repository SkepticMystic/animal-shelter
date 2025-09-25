<script lang="ts">
  import { HTMLUtil, type IHTML } from "$lib/utils/html/html.util";
  import { Carta, Markdown } from "carta-md";

  let { value }: { value: IHTML.Sanitized } = $props();

  const carta = new Carta({
    sanitizer: HTMLUtil.sanitize,
  });
</script>

<Markdown {carta} {value} />
