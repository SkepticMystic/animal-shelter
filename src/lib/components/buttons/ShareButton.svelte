<script lang="ts">
  import { ICONS } from "$lib/const/icon.const";
  import { SHARE } from "$lib/const/share.const";
  import { Share } from "$lib/utils/share/share.util";
  import Button from "../ui/button/button.svelte";
  import Dialog from "../ui/dialog/dialog.svelte";
  import Icon from "../ui/icon/Icon.svelte";

  let {
    data,
  }: {
    data: ShareData;
  } = $props();

  // NOTE: This allows passing `undefined` to leave out the property
  if (!Object.hasOwn(data, "url")) {
    data.url = window.location.href;
  }
</script>

{#if navigator.canShare?.(data)}
  <Button
    variant="outline"
    icon={ICONS.SHARE}
    onclick={() => Share.native(data)}
  />
{:else}
  <Dialog
    size="icon"
    title="Share"
    variant="outline"
    description="Share {data.title || 'this page'} on"
  >
    {#snippet trigger()}
      <Icon icon={ICONS.SHARE} />
    {/snippet}

    {#snippet content()}
      <div class="grid grid-cols-1 gap-1 sm:grid-cols-2 md:grid-cols-3">
        {#each SHARE.SOCIAL.IDS as social_id}
          {@const platform = SHARE.SOCIAL.MAP[social_id]}

          <Button
            target="_blank"
            variant="outline"
            icon={platform.icon}
            title="Share on {platform.label}"
            href={Share.build_social_url[social_id](data).toString()}
          >
            {SHARE.SOCIAL.MAP[social_id].label}
          </Button>
        {/each}
      </div>
    {/snippet}
  </Dialog>
{/if}
