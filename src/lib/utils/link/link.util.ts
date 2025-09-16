import type { ILink } from "$lib/const/link.const";
import type { Link } from "$lib/schema/link.schema";
import { parsePhoneNumber } from "libphonenumber-js/min";
import { Url } from "../urls";

const get_kind = (link: Link): ILink.KindId => {
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

const format_href = (link: Link): string => {
  const kind = get_kind(link);

  switch (kind) {
    case "https": {
      const url = Url.safe(link.href);
      if (!url) return link.href;

      return (url.hostname + url.pathname)
        .replace(/^www\./, "") // Remove www.
        .replace(/\/$/, ""); // Remove trailing slash
    }

    case "mailto": {
      return Url.strip_protocol(link.href);
    }

    case "tel": {
      const tel = Url.strip_protocol(link.href);

      return parsePhoneNumber(tel)?.formatNational() ?? tel;
    }
  }
};

export const LinkUtil = {
  get_kind,
  format_href,
};
