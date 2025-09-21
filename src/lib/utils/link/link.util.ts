import type { ILink } from "$lib/const/link.const";
import type { Link } from "$lib/schema/link.schema";
import { parsePhoneNumber } from "libphonenumber-js/min";
import { Url } from "../urls";

const get_kind = (link: Omit<Link, "id">): ILink.KindId => {
  if (link.href.startsWith("https://")) {
    return "https";
  } else if (link.href.startsWith("mailto:")) {
    return "mailto";
  } else if (link.href.startsWith("tel:")) {
    return "tel";
  } else {
    return "https";
  }
};

const format_href = (link: Omit<Link, "id">, parts?: (keyof URL)[]): string => {
  const kind = get_kind(link);

  switch (kind) {
    case "https": {
      const url = Url.safe(link.href);
      if (!url) return link.href;

      parts ??= ["hostname", "pathname"];

      return parts
        .map((key) => String(url[key]))
        .join("")
        .replace(/^www\./, "") // Remove www.
        .replace(/\/$/, ""); // Remove trailing slash
    }

    case "mailto": {
      return Url.strip_protocol(link.href);
    }

    case "tel": {
      const tel = Url.strip_protocol(link.href);

      try {
        return parsePhoneNumber(tel).formatNational();
      } catch (error) {
        return tel;
      }
    }
  }
};

export const LinkUtil = {
  get_kind,
  format_href,
};
