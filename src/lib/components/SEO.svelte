<script lang="ts">
  import { page } from "$app/state";
  import { APP } from "$lib/const/app";

  let image = $derived(page.data.seo?.image ?? APP.LOGO);

  let description = $derived(page.data.seo?.description ?? APP.DESCRIPTION);

  let title = $derived(
    page.data.seo?.title ? page.data.seo.title + ` | ${APP.NAME}` : APP.NAME,
  );
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

<meta property="og:image" content={image} />
<meta property="twitter:image" content={image} />
<meta property="og:image:secure_url" content={image} />

<meta
  property="twitter:card"
  content={page.data.seo?.image ? "summary_large_image" : "summary"}
/>
