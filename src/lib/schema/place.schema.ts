import { PLACES } from "../const/place.const";
import z from "zod";

export const place_schema = z.object({
  external_id: z.string(),
  provider_id: z.enum(PLACES.PROVIDER.IDS),

  name: z.string().optional(),
  formatted_address: z.string().optional(),
  coords: z.object({ lat: z.number(), lng: z.number() }).optional(),
});

export type Place = z.infer<typeof place_schema>;
