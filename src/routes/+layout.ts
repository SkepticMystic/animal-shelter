import { APP } from "$lib/const/app";
import type { LayoutLoad } from "./$types";

export const load = (({ url }) => {
  const href = new URL(url.pathname, url.origin).href;

  const image = {
    // width: 800,
    // height: 600,
    type: "image/svg+xml",
    alt: APP.NAME + " Logo",
    url: APP.URL + APP.LOGO,
    secureUrl: APP.URL + APP.LOGO,
  };

  const base_seo = Object.freeze({
    title: APP.NAME,
    titleTemplate: "%s | " + APP.NAME,
    description: APP.DESCRIPTION,

    canonical: href,

    openGraph: {
      url: href,
      type: "website", // ?

      locale: "en_ZA",
      images: [image],
      title: APP.NAME,
      siteName: APP.NAME, // ?
      description: APP.DESCRIPTION,
    },

    twitter: {
      title: APP.NAME,
      image: APP.LOGO,
      description: APP.DESCRIPTION,
      cardType: "summary_large_image" as const,
    },
  }) satisfies App.PageData["seo"];

  return {
    base_seo,
  };
}) satisfies LayoutLoad;
