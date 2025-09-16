<script lang="ts">
  import type { ComponentProps, Snippet } from "svelte";
  import Icon from "./Icon.svelte";

  let {
    children,
    reversed = false,
    ...rest_props
  }: ComponentProps<typeof Icon> & {
    reversed?: boolean;
    children: Snippet;
  } = $props();
</script>

<span
  class={[
    "flex items-center gap-1.5",
    reversed && "flex-row-reverse justify-end",
  ]}
>
  <Icon {...rest_props} />
  {@render children()}
</span>
