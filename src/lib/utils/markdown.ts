import strip from "remove-markdown";
import Turndown from "turndown";
import type { IHTML } from "./html/html.util";
import { Json } from "./json";
import { carta } from "./markdown/carta.util";

const turndown = new Turndown();

export const Markdown = {
  codeblock: (code: unknown) =>
    `\n\`\`\`\n${Json.str_or_stringify(code)}\n\`\`\`\n`,

  from_html: (html: string) => turndown.turndown(html),
  to_html: (md: string) => carta.renderSSR(md) as IHTML.Prerendered,

  strip,
};
