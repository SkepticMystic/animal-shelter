import { APP } from "$lib/const/app";
import { ROUTE_MAP } from "$lib/const/routes.const";
import type { LayoutLoad } from "./$types";

export const load = (({ url, route }) => {
  const href = new URL(url.pathname, url.origin).href;

  const image = {
    // width: 800,
    // height: 600,
    type: "image/svg+xml",
    alt: APP.NAME + " Logo",
    url: APP.URL + APP.LOGO,
    secureUrl: APP.URL + APP.LOGO,
  };

  const title = ROUTE_MAP[route.id || "/"]?.label || APP.NAME;

  const base_seo = Object.freeze({
    title,
    titleTemplate: "%s | " + APP.NAME,
    description: APP.DESCRIPTION,

    canonical: href,

    openGraph: {
      title,
      url: href,
      type: "website", // ?

      locale: "en_ZA",
      images: [image],
      siteName: APP.NAME, // ?
      description: APP.DESCRIPTION,
    },

    twitter: {
      title,
      image: APP.LOGO,
      description: APP.DESCRIPTION,
      cardType: "summary_large_image" as const,
    },
  }) satisfies App.PageData["seo"];

  return {
    base_seo,
  };
}) satisfies LayoutLoad;
