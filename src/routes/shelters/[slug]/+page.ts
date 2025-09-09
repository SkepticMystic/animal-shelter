import type { PageLoad } from "./$types";

export const load = (async ({ data }) => {
  return {
    ...data,
    seo: {
      // desc: data.shelter.bio,
      title: data.shelter.name,
    } satisfies App.PageData["seo"],
  };
}) satisfies PageLoad;
