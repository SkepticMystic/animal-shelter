import { ANIMALS } from "$lib/const/animal.const";
import { SEOUtil } from "$lib/utils/SEO/SEO.util";
import type { PageLoad } from "./$types";

export const load = (async ({ data }) => {
  return {
    ...data,
    seo: SEOUtil.transform_page({
      description: data.animal.description,
      image: data.animal.images.at(0)?.url,
      title: `${ANIMALS.SPECIES.MAP[data.animal.species]?.label ?? data.animal.species}: ${data.animal.name}`,
    }),
  };
}) satisfies PageLoad;
