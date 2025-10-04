import { ANIMALS } from "$lib/const/animal.const";
import { SEOUtil } from "$lib/utils/SEO/SEO.util";
import type { PageLoad } from "./$types";

export const load = (async ({ data }) => {
  return {
    ...data,
    seo: SEOUtil.transform({
      description: data.animal.description ?? undefined,
      title: `${ANIMALS.SPECIES.MAP[data.animal.species]?.label ?? data.animal.species}: ${data.animal.name}`,
      openGraph: { images: data.animal.images },
    }),
  };
}) satisfies PageLoad;
