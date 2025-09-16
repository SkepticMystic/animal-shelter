<script lang="ts">
  import { PUBLIC_GOOGLE_MAPS_API_KEY } from "$env/static/public";
  import type { Place } from "$lib/schema/place.schema";
  import { cn } from "$lib/utils/shadcn.util";
  import type { HTMLIframeAttributes } from "svelte/elements";

  let { place, ...rest_props }: HTMLIframeAttributes & { place: Place } =
    $props();
</script>

<iframe
  class={cn("w-full border-0", rest_props.class)}
  height="400"
  loading="lazy"
  allowfullscreen
  title={place.formatted_address}
  referrerpolicy="no-referrer-when-downgrade"
  src="https://www.google.com/maps/embed/v1/place?key={PUBLIC_GOOGLE_MAPS_API_KEY}
  &q=place_id:{encodeURIComponent(place.external_id)}&zoom=14"
  {...rest_props}
>
</iframe>
