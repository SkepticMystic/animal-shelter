import { SEOUtil } from "$lib/utils/SEO/SEO.util";
import type { PageLoad } from "./$types";

export const load = (async ({ data }) => {
  return {
    ...data,
    seo: SEOUtil.transform({
      title: data.shelter.name,
      description: data.shelter.description ?? undefined,
      openGraph: {
        images: data.shelter.images,
      },
    }),
  };
}) satisfies PageLoad;
