import { APP } from "$lib/const/app";
import type { RequestHandler } from "./$types";

export const prerender = true;

export const GET: RequestHandler = async () => {
  const body = [
    "User-agent: *",
    "Allow: /",
    "",
    `Sitemap: ${APP.URL}/sitemap.xml`,
  ]
    .join("\n")
    .trim();

  const headers = {
    "Content-Type": "text/plain",
  };

  return new Response(body, { headers });
};
