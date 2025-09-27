<script lang="ts">
  import { APP } from "$lib/const/app";

  let { size = "size-7" }: { size?: `size-${number}` } = $props();
</script>

<img src={APP.LOGO} alt="{APP.NAME} Logo" class={size} />
