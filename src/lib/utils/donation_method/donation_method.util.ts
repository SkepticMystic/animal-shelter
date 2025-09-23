import type { DonationMethod } from "$lib/schema/donation_method.schema";
import { LinkUtil } from "../link/link.util";

const format = (donation_method: DonationMethod): string => {
  switch (donation_method.data.kind) {
    case "url": {
      return LinkUtil.format_href(donation_method.data);
    }

    case "bank": {
      const parts = [
        donation_method.data.bank_name,
        donation_method.data.account_number,
      ].filter(Boolean);

      if (!parts.length) return "";
      else return parts.join(" - ");
    }
  }
};

export const DonationMethodUtil = {
  format,
};
