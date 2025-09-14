<script lang="ts">
  import { ICONS } from "$lib/const/icon.const";
  import { SHARE } from "$lib/const/share.const";
  import Dialog from "../ui/dialog/dialog.svelte";
  import Icon from "../ui/icon/Icon.svelte";
  import NativeShareButton from "./NativeShareButton.svelte";
  import SocialShareButton from "./SocialShareButton.svelte";

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

{#if navigator.share}
  <NativeShareButton {data} />
{:else}
  <Dialog
    title="Share"
    size="icon"
    variant="outline"
    description="Share this content"
  >
    {#snippet trigger()}
      <Icon icon={ICONS.SHARE} />
    {/snippet}

    {#snippet content()}
      <div class="grid grid-cols-1 gap-1 sm:grid-cols-2 md:grid-cols-3">
        {#each SHARE.SOCIAL.IDS as social_id}
          <SocialShareButton {social_id} {data}>
            {SHARE.SOCIAL.MAP[social_id].label}
          </SocialShareButton>
        {/each}
      </div>
    {/snippet}
  </Dialog>
{/if}
