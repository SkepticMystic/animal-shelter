import z from "zod";
import type { IDonationMethod } from "../const/donation_method.const";
import { Url } from "../utils/urls";

export const donation_method_schema = z.object({
  id: z.string().min(1),
  label: z.string().max(100).optional(),

  data: z.discriminatedUnion("kind", [
    z.object({
      kind: z.literal("url" satisfies IDonationMethod.KindId),
      // NOTE: Don't use the whole LinkSchema, we already have a label on the base_schema above
      href: Url.schema("https"),
    }),

    z.object({
      kind: z.literal("bank" satisfies IDonationMethod.KindId),

      bank_name: z.string().min(2).max(255),
      account_number: z.string().min(5).max(50),
      branch_code: z.string().max(50).optional(),
      reference: z.string().max(50).optional(),
      swift_code: z.string().max(50).optional(),
    }),
  ]),
});

export type DonationMethod = z.infer<typeof donation_method_schema>;
