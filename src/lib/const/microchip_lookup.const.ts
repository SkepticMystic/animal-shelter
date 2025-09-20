const AGGREGATOR_IDS = ["findmychip"] as const;

// NOTE: These IDs are ordered by data quality (according to FindMyChip creator)
const DATABASE_IDS = [
  "agrichip",
  "identipet",
  "communipet",
  "getmeknown",
  "virbac",
  "fivestarid",
] as const;

export const MICROCHIP_LOOKUP = {
  AGGREGATOR: {
    IDS: AGGREGATOR_IDS,
  },

  DATABASE: {
    IDS: DATABASE_IDS,
  },
};

export declare namespace IMicrochipLookup {
  type AggregatorId = (typeof AGGREGATOR_IDS)[number];
  type DatabaseId = (typeof DATABASE_IDS)[number];
}
