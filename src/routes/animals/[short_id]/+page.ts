import { ANIMALS } from "$lib/const/animal.const";
import type { PageLoad } from "./$types";

export const load = (async ({ data }) => {
  return {
    ...data,
    seo: {
      desc: data.animal.bio,
      title: `${ANIMALS.SPECIES.MAP[data.animal.species]?.label ?? data.animal.species}: ${data.animal.name}`,
    } satisfies App.PageData["seo"],
  };
}) satisfies PageLoad;
