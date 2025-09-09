<script lang="ts">
  import BackButton from "$lib/components/buttons/BackButton.svelte";

  let { data } = $props();
</script>

<BackButton />

<pre>{JSON.stringify(data.shelter, null, 2)}</pre>
