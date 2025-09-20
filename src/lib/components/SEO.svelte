<script lang="ts">
  import { page } from "$app/state";
  import { APP } from "$lib/const/app";

  let title = $derived(
    page.data.seo?.title ? page.data.seo.title + ` | ${APP.NAME}` : APP.NAME,
  );

  let description = $derived(page.data.seo?.description ?? APP.DESCRIPTION);
</script>

<title>
  {title}
</title>

<meta property="title" content={title} />
<meta property="og:title" content={title} />
<meta property="twitter:title" content={title} />

<meta property="og:url" content={page.url.href} />
<meta property="og:site_name" content={APP.NAME} />

<meta property="description" content={description} />
<meta property="og:description" content={description} />
<meta property="twitter:description" content={description} />

{#if page.data.seo?.image}
  <meta property="og:image" content={page.data.seo.image} />
  <meta property="og:image:secure_url" content={page.data.seo.image} />
  <meta property="twitter:image" content={page.data.seo.image} />
{/if}

<meta
  property="twitter:card"
  content={page.data.seo?.image ? "summary_large_image" : "summary"}
/>
