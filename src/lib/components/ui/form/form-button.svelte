<script lang="ts" generics="T extends Record<string, unknown>, M">
  import {
    Root as Button,
    type ButtonProps,
  } from "$lib/components/ui/button/index.js";
  import type { FsSuperForm } from "formsnap";
  import type { Readable } from "svelte/store";

  let {
    form,
    ref = $bindable(null),
    ...button
  }: Omit<ButtonProps, "form"> & {
    form: FsSuperForm<T, M> & { pending?: Readable<boolean> };
  } = $props();

  let { submitting, pending, delayed } = form;
</script>

<Button
  bind:ref
  type="submit"
  loading={$delayed || $pending}
  disabled={$submitting || $pending}
  {...button}
/>
