import type { RouteId } from "$app/types";
import { db } from "$lib/server/db/drizzle.db";
import type { RequestHandler } from "@sveltejs/kit";
import * as sitemap from "super-sitemap";

// export const prerender = true;

export const GET: RequestHandler = async ({ url }) => {
  const [animals, shelters] = await Promise.all([
    db.query.animal.findMany({
      columns: { short_id: true, updatedAt: true },
    }),

    db.query.shelter.findMany({
      columns: { short_id: true, updatedAt: true },
    }),
  ]);

  return await sitemap.response({
    origin: url.origin,

    excludeRoutePatterns: ["^/admin", "^/s$", "^/s/"],

    paramValues: {
      "/animals/[short_id]": animals.map((animal) => ({
        values: [animal.short_id],
        lastmod: animal.updatedAt?.toISOString(),
      })),

      "/shelters/[short_id]": shelters.map((shelter) => ({
        values: [shelter.short_id],
        lastmod: shelter.updatedAt?.toISOString(),
      })),
    } satisfies Partial<Record<RouteId, sitemap.ParamValues[string]>>,
  });
};
