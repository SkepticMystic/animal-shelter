import { Carta } from "carta-md";
import DOMPurify from "isomorphic-dompurify";

// Intended for server-side rendering only
export const carta = new Carta({
  sanitizer: DOMPurify.sanitize,
});
