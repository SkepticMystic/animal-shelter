import { APP } from "$lib/const/app";
import { Markdown } from "../markdown";
import { Url } from "../urls";

type UTMData = {
  /**
   * Identifies the source of the traffic, such as a search engine or newsletter.
   * utm_source=google
   */
  source?: string;
  /**
   * Identifies search terms.
   * utm_term=running+shoes */
  term?: string;
  /**
   * Identifies what type of link was used, such as email or pay-per-click advertising.
   * utm_medium=ppc
   */
  medium?: string;
  /**
   * Identifies what specifically was clicked to bring the user to the site, such as a banner ad or a text link. It is often used for A/B testing and content-targeted ads.
   * utm_content=textlink
   */
  content?: string;
  /**
   * Identifies a specific product promotion or strategic campaign.
   * utm_campaign=spring_sale
   */
  campaign?: string;
};

const utmify = (href: string, params: UTMData) => {
  const resolved = {
    utm_term: params.term,
    utm_medium: params.medium,
    utm_content: params.content,
    utm_campaign: params.campaign,
    utm_source: params.source ?? APP.DOMAIN,
  };

  const url = Url.safe(href);
  if (!url) return href;

  return Url.add_search(url, resolved).toString();
};

const transform_page = (
  seo: NonNullable<App.PageData["seo"]>,
): NonNullable<App.PageData["seo"]> => ({
  ...seo,
  description: seo.description
    ? Markdown.strip(seo.description).slice(0, 160)
    : undefined,
});

export const SEOUtil = {
  utmify,
  transform_page,
};
