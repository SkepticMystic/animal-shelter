<script lang="ts">
  import { page } from "$app/state";
  import { APP } from "$lib/const/app";
  import { CldOgImage } from "svelte-cloudinary";

  let title = $derived(
    page.data.seo?.title ? page.data.seo.title + ` | ${APP.NAME}` : APP.NAME,
  );

  let desc = $derived(page.data.seo?.desc ?? APP.DESCRIPTION);
</script>

<title>
  {title}
</title>

<meta property="title" content={title} />
<meta property="og:title" content={title} />
<meta property="twitter:title" content={title} />

<meta property="og:url" content={page.url.href} />
<meta property="og:site_name" content={APP.NAME} />

<meta property="description" content={desc} />
<meta property="og:description" content={desc} />
<meta property="twitter:description" content={desc} />

{#if page.data.seo?.image}
  <CldOgImage src={page.data.seo.image} alt={title} />
{/if}
