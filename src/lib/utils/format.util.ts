import { DateFormatter } from "@internationalized/date";
import { formatRelative, type FormatRelativeOptions } from "date-fns";
import {
  daysInWeek,
  minutesInHour,
  monthsInYear,
  secondsInMinute,
} from "date-fns/constants";
import { Guard } from "./guard.util";

const DEFAULT_OPTIONS = {
  number: {
    style: "decimal",
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  } satisfies Intl.NumberFormatOptions,

  percent: {
    style: "percent",
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  } satisfies Intl.NumberFormatOptions,

  currency: {
    currency: "ZAR",
    style: "currency",
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
    currencyDisplay: "narrowSymbol",
  } satisfies Intl.NumberFormatOptions,

  date: {
    dateStyle: "medium",
  } satisfies Intl.DateTimeFormatOptions,

  datetime: {
    dateStyle: "medium",
    timeStyle: "short",
  } satisfies Intl.DateTimeFormatOptions,

  daterange: {
    dateStyle: "medium",
    timeStyle: "short",
  } satisfies Intl.DateTimeFormatOptions,

  date_distance: {
    numeric: "auto",
  } satisfies Intl.RelativeTimeFormatOptions,
};

const DEFAULT_FORMATTERS = {
  number: new Intl.NumberFormat("en", DEFAULT_OPTIONS.number),
  percent: new Intl.NumberFormat("en", DEFAULT_OPTIONS.percent),
  currency: new Intl.NumberFormat("en", DEFAULT_OPTIONS.currency),

  date: new DateFormatter("en", DEFAULT_OPTIONS.date),
  datetime: new DateFormatter("en", DEFAULT_OPTIONS.datetime),
  daterange: new DateFormatter("en", DEFAULT_OPTIONS.daterange),

  date_distance: new Intl.RelativeTimeFormat(
    "en",
    DEFAULT_OPTIONS.date_distance,
  ),
} satisfies Record<
  keyof typeof DEFAULT_OPTIONS,
  Intl.NumberFormat | Intl.RelativeTimeFormat | DateFormatter
>;

const BALANCE_DURATION_DIVISIONS = [
  { amount: secondsInMinute, unit: "seconds" as const },
  { amount: minutesInHour, unit: "minutes" as const },
  { amount: 24, unit: "hours" as const },
  { amount: daysInWeek, unit: "days" as const },
  { amount: 4.34524, unit: "weeks" as const },
  { amount: monthsInYear, unit: "months" as const },
  { amount: Number.POSITIVE_INFINITY, unit: "years" as const },
];

export const Format = {
  number: (
    amount: number | undefined | null,
    opts?: Intl.NumberFormatOptions,
  ) => {
    if (Guard.is_nullish(amount) || Guard.is_nan(amount)) {
      return "-";
    } else {
      return opts
        ? new Intl.NumberFormat("en", {
            ...DEFAULT_OPTIONS.number,
            ...opts,
          }).format(amount)
        : DEFAULT_FORMATTERS.number.format(amount);
    }
  },

  currency: (
    amount: number | undefined | null,
    opts?: Intl.NumberFormatOptions,
  ) => {
    if (Guard.is_nullish(amount) || Guard.is_nan(amount)) {
      return "-";
    } else {
      return opts
        ? new Intl.NumberFormat("en", {
            ...DEFAULT_OPTIONS.currency,
            ...opts,
          }).format(amount)
        : DEFAULT_FORMATTERS.currency.format(amount);
    }
  },

  percent: (
    amount: number | undefined | null,
    opts?: Intl.NumberFormatOptions,
  ) => {
    if (Guard.is_nullish(amount) || Guard.is_nan(amount)) {
      return "-";
    } else {
      return opts
        ? new Intl.NumberFormat("en", {
            ...DEFAULT_OPTIONS.percent,
            ...opts,
          }).format(amount)
        : DEFAULT_FORMATTERS.percent.format(amount);
    }
  },

  boolean: (bool: boolean, opts?: { type?: "Y/N" | "emoji" }) => {
    switch (opts?.type) {
      case "Y/N": {
        return bool ? "Yes" : "No";
      }

      case "emoji":
      default: {
        return bool ? "✅" : "❌";
      }
    }
  },

  date: (
    date: Date | string | number | undefined | null,
    opts?: Intl.DateTimeFormatOptions,
  ) => {
    if (Guard.is_nullish(date)) {
      return "-";
    } else {
      const dt = new Date(date);

      return opts
        ? new DateFormatter("en-ZA", {
            ...DEFAULT_OPTIONS.date,
            ...opts,
          }).format(dt)
        : DEFAULT_FORMATTERS.date.format(dt);
    }
  },

  datetime: (
    date: Date | string | number | undefined | null,
    opts?: Intl.DateTimeFormatOptions,
  ) => {
    if (Guard.is_nullish(date)) {
      return "-";
    } else {
      const dt = new Date(date);

      return opts
        ? new DateFormatter("en-ZA", {
            ...DEFAULT_OPTIONS.datetime,
            ...opts,
          }).format(dt)
        : DEFAULT_FORMATTERS.datetime.format(dt);
    }
  },

  daterange: (
    range:
      | { start: Date | undefined; end: Date | undefined }
      | undefined
      | null,
    opts?: Intl.DateTimeFormatOptions,
  ) => {
    if (Guard.is_nullish(range) || (!range.start && !range.end)) {
      return "";
    }

    const format = opts
      ? new DateFormatter("en-ZA", {
          ...DEFAULT_OPTIONS.daterange,
          ...opts,
        }).format
      : DEFAULT_FORMATTERS.daterange.format;

    if (range.start && range.end) {
      return `${format(range.start)} - ${format(range.end)}`;
    } else if (range.start) {
      return `From ${format(range.start)}`;
    } else {
      return `Until ${format(range.end!)}`;
    }
  },

  date_relative: (
    date: Date | string | number | undefined | null,
    options?: FormatRelativeOptions & { base?: Date | string | number },
  ) => {
    if (Guard.is_nullish(date)) {
      return "-";
    } else {
      return formatRelative(
        new Date(date),
        options?.base ? new Date(options.base) : new Date(),
        options,
      );
    }
  },

  // date_distance: (
  //   date: Date | string | number | undefined | null,
  //   options?: FormatDistanceOptions & { base?: Date | string | number },
  // ) => {
  //   if (Guard.is_nullish(date)) {
  //     return "-";
  //   } else {
  //     return formatDistance(
  //       new Date(date),
  //       options?.base ? new Date(options.base) : new Date(),
  //       options,
  //     );
  //   }
  // },

  date_distance: (
    date: Date | string | number | undefined | null,
    opts?: Intl.RelativeTimeFormatOptions & {
      suffix?: boolean | string;
      base?: Date | string | number;
    },
  ) => {
    if (Guard.is_nullish(date)) {
      return "-";
    } else {
      const to = new Date(date);
      const from = opts?.base ? new Date(opts.base) : new Date();
      const diff_ms = to.getTime() - from.getTime();

      let remaining = diff_ms / 1000;
      let delta: { value: number; unit: Intl.RelativeTimeFormatUnit } | null =
        null;

      for (const division of BALANCE_DURATION_DIVISIONS) {
        if (Math.abs(remaining) < division.amount) {
          delta = { value: Math.round(remaining), unit: division.unit };
          break;
        }

        remaining /= division.amount;
      }

      // Fallback to years if something goes wrong
      if (!delta) {
        delta = { value: Math.round(remaining), unit: "years" };
      }

      const formatted = opts
        ? new Intl.RelativeTimeFormat("en", {
            ...DEFAULT_OPTIONS.date_distance,
            ...opts,
          }).format(delta.value, delta.unit)
        : DEFAULT_FORMATTERS.date_distance.format(delta.value, delta.unit);

      if (opts?.suffix === false || typeof opts?.suffix === "string") {
        return formatted.replace(
          / ago| from now/,
          opts.suffix ? ` ${opts.suffix}` : "",
        );
      } else {
        return formatted;
      }
    }
  },
};
