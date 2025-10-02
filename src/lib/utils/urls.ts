import z from "zod";
import { LINKS, type ILink } from "../const/link.const";
import { tel_schema } from "../schema/tel.schema";

const add_search = (
  url: URL,
  search: URLSearchParams | Record<string, unknown>,
) => {
  const resolved =
    search instanceof URLSearchParams ? Object.fromEntries(search) : search;

  for (const key in resolved) {
    if (resolved[key] === undefined) continue;

    url.searchParams.set(key, String(resolved[key]));
  }

  return url;
};

const build = (
  base: string,
  path: string,
  search?: URLSearchParams | Record<string, unknown>,
) => {
  const url = new URL(base + path);

  if (search) {
    add_search(url, search);
  }

  return url;
};

const safe = (url: string | URL) => {
  try {
    return new URL(url);
  } catch (_error) {
    return null;
  }
};

const strip_protocol = (href: string) => {
  if (href.startsWith("https://")) {
    return href.slice(8);
  } else if (href.startsWith("http://")) {
    return href.slice(7);
  } else if (href.startsWith("mailto:")) {
    return href.slice(7);
  } else if (href.startsWith("tel:")) {
    return href.slice(4);
  } else {
    return href;
  }
};

const add_protocol = (kind: ILink.KindId, href: string) => {
  switch (kind) {
    case "https": {
      return `https://${href}`;
    }

    case "mailto": {
      return `mailto:${href}`;
    }

    case "tel": {
      return `tel:${href}`;
    }

    default: {
      return href;
    }
  }
};

const schema = (kind: ILink.KindId) => {
  const kind_label = LINKS.KIND.MAP[kind].label;

  return z
    .string()
    .trim()
    .min(1, `${kind_label} must be atleast 1 character`)
    .max(2048)
    .transform((href) => Url.strip_protocol(href).trim().replace(/\/+$/, ""))
    .transform((href, ctx) => {
      try {
        switch (kind) {
          case "tel": {
            return tel_schema.number.parse(href);
          }

          case "mailto": {
            return z.email().parse(href);
          }

          case "https": {
            // We check url validity later
            return href;
          }
        }
      } catch (error) {
        if (error instanceof z.ZodError) {
          ctx.addIssue({
            ...error.issues[0],
            continue: false,
          });
        } else {
          ctx.addIssue({
            continue: false,
            code: "custom",
            message: `Invalid ${kind_label}`,
          });
        }

        return z.NEVER;
      }
    })
    .transform((href) => Url.add_protocol(kind, href))
    .transform((href, ctx) => {
      try {
        return z.url({ normalize: true }).parse(href);
      } catch (_) {
        ctx.addIssue({
          continue: false,
          code: "custom",
          message: `Invalid ${kind_label}`,
        });

        return z.NEVER;
      }
    });
};

export const Url = {
  safe,
  build,
  schema,
  add_search,
  add_protocol,
  strip_protocol,
  strip_origin: (url: URL) => url.pathname + url.search + url.hash,
};
