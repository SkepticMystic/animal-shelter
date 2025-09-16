import z from "zod";
import { type ILink } from "../const/link.const";
import { Url } from "../utils/urls";

const link_schema = (kind: ILink.KindId) =>
  z.object({
    id: z.string(),

    href: Url.schema(kind),
    label: z.string().trim().max(50),
  });

export const LinkSchema = {
  tel: link_schema("tel"),
  https: link_schema("https"),
  mailto: link_schema("mailto"),
} satisfies Record<ILink.KindId, ReturnType<typeof link_schema>>;

export type Link = z.infer<ReturnType<typeof link_schema>>;
