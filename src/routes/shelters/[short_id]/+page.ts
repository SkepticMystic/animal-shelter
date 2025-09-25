import { SEOUtil } from "$lib/utils/SEO/SEO.util";
import type { PageLoad } from "./$types";

export const load = (async ({ data }) => {
  return {
    ...data,
    seo: SEOUtil.transform_page({
      title: data.shelter.name,
      image: data.shelter.images[0]?.url,
      description: data.shelter.description,
    }),
  };
}) satisfies PageLoad;
