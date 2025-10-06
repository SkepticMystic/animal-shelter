import type { SelectOption } from "$lib/interfaces";
import type { donation_method_schema } from "$lib/schema/donation_method.schema";
import type { ClassValue } from "svelte/elements";
import type z from "zod";

const KIND_IDS = ["bank", "url"] as const;

const KIND_MAP = {
  bank: {
    label: "Bank Details",
    icon: "lucide/building",
  },
  url: {
    label: "Website",
    icon: "lucide/link",
  },
} satisfies Record<
  IDonationMethod.KindId,
  {
    label: string;
    icon: ClassValue;
  }
>;

export const DONATION_METHOD = {
  KIND: {
    IDS: KIND_IDS,
    MAP: KIND_MAP,
    OPTIONS: KIND_IDS.map((id) => ({
      value: id,
      label: KIND_MAP[id].label,
    })) satisfies SelectOption<IDonationMethod.KindId>[],

    DEFAULTS: {
      bank: {
        kind: "bank",
        bank_name: "",
        account_number: "",
      },
      url: {
        kind: "url",
        href: "",
      },
    } satisfies {
      [K in IDonationMethod.KindId]: Extract<
        z.infer<typeof donation_method_schema>["data"],
        { kind: K }
      >;
    },
  },
};

export declare namespace IDonationMethod {
  type KindId = (typeof KIND_IDS)[number];
}
