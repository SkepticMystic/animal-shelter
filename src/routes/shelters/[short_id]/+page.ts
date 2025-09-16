import type { PageLoad } from "./$types";

export const load = (async ({ data }) => {
  return {
    ...data,
    seo: {
      title: data.shelter.name,
      image: data.shelter.images[0]?.url,
      description: data.shelter.description,
    } satisfies App.PageData["seo"],
  };
}) satisfies PageLoad;
