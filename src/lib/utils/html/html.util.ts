import type { Branded } from "$lib/interfaces";
import DOMPurify from "isomorphic-dompurify";

export const HTMLUtil = {
  sanitize: (dirty: string) => DOMPurify.sanitize(dirty) as IHTML.Sanitized,
};

export declare namespace IHTML {
  type Sanitized = Branded<"SanitizedHTML">;

  type Prerendered = Branded<"PrerenderedHTML">;
}
