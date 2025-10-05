<script lang="ts">
  import type { ComponentProps, Snippet } from "svelte";
  import AlertDescription from "./alert-description.svelte";
  import AlertRoot from "./alert-root.svelte";
  import AlertTitle from "./alert-title.svelte";

  let {
    title,
    description,
    ...props
  }: Omit<ComponentProps<typeof AlertRoot>, "title"> & {
    title: Snippet;
    description: Snippet;
  } = $props();
</script>

<AlertRoot {...props}>
  <AlertTitle>
    {@render title()}
  </AlertTitle>

  <AlertDescription>
    {@render description()}
  </AlertDescription>
</AlertRoot>
