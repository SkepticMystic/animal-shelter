<script lang="ts">
  import { dev } from "$app/environment";
  import { PUBLIC_GOOGLE_MAPS_API_KEY } from "$env/static/public";
  import GoogleMap from "$lib/components/map/GoogleMap.svelte";
  import Dialog from "$lib/components/ui/dialog/dialog.svelte";
  import Icon from "$lib/components/ui/icon/Icon.svelte";
  import type { MaybePromise } from "$lib/interfaces";
  import type { Place } from "$lib/schema/place.schema";
  import { cn } from "$lib/utils/shadcn.util";
  import { PlaceAutocomplete } from "places-autocomplete-svelte";
  import type {
    ComponentOptions,
    RequestParams,
  } from "places-autocomplete-svelte/interfaces";
  import { useGeolocation } from "runed";
  import { toast } from "svelte-sonner";

  let {
    on_change,
    place = $bindable(),
    ...rest_props
  }: {
    place?: Place | null | undefined;
    on_change?: (place: Place) => MaybePromise<unknown>;
  } = $props();

  const geolocation = dev ? null : useGeolocation();

  // Control API request parameters
  const requestParams: Partial<RequestParams> = $state({
    region: "ZA",
    language: "en-ZA",
    includedRegionCodes: ["ZA"], // Only show results in the specified regions,
    input: place?.formatted_address ?? "",

    // The origin point from which to calculate geodesic distance to the destination
    origin:
      !geolocation || geolocation.error
        ? undefined
        : {
            lat: geolocation.position.coords.latitude,
            lng: geolocation.position.coords.longitude,
          },
  });

  // Control which data fields are fetched for Place Details (affects cost!)
  const fetchFields: string[] = $state([
    "id", // place_id
    "name", // string
    "displayName", // string
    "formattedAddress", // string
    "location", // { lat: number, lng: number }
  ]);

  // Control component appearance and behavior
  const options: Partial<ComponentOptions> = $state({
    debounce: 200, // Debounce input by 200ms (default is 100ms)
    distance: true, // Show distance if origin is provided in requestParams
    distance_units: "km", // Use kilometers for distance (default is 'miles')
    autocomplete: "on",
    clear_input: false,
    placeholder: "Search for an address...",

    // TODO: Change indigo highlight colour
    // SOURCE: https://places-autocomplete-demo.pages.dev/examples/styling
    classes: {
      section: "grow",
      container: "relative z-10 transform rounded-md",
      icon_container: "hidden",
      //   "pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3",
      // icon: '<span class="icon lucide/search"></span>',

      // Copy pasted from Input.svelte
      input: cn(
        "flex h-9 px-3 py-1 w-full min-w-0 rounded-md border border-input bg-background",
        "text-base shadow-xs ring-offset-background transition-[color,box-shadow] outline-none selection:bg-primary selection:text-primary-foreground placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-input/30",
        "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
      ),

      kbd_container: "absolute inset-y-0 right-0 flex py-1.5 pr-1.5",
      kbd_escape:
        "inline-flex items-center rounded border border-gray-300 px-1 font-sans text-xs text-gray-500 w-8 mr-1",
      kbd_up:
        "inline-flex items-center justify-center rounded border border-gray-300 px-1 font-sans text-xs text-gray-500 w-6",
      kbd_down:
        "inline-flex items-center rounded border border-gray-400 px-1 font-sans text-xs text-gray-500 justify-center w-6",
      kbd_active: "bg-accent text-accent-foreground",

      ul: "absolute z-50 -mb-2 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm divide-y divide-gray-100",
      li: "z-50 cursor-default select-none py-2 px-2 lg:px-4 text-gray-900 hover:bg-accent hover:text-accent-foreground",
      li_current: "bg-accent",
      li_a: "block w-full flex justify-between",
      li_a_current: "text-white",
      li_div_container: "flex min-w-0 gap-x-4",
      li_div_one: "min-w-0 flex-auto",
      li_div_one_p: "text-sm/6 ",
      li_div_two: "shrink-0 flex flex-col items-end min-w-16",
      li_div_two_p: "mt-1 text-xs/5",
      highlight: "font-bold",
    },
  });
</script>

<div class="flex gap-1.5">
  <PlaceAutocomplete
    {...rest_props}
    {options}
    {fetchFields}
    {requestParams}
    {PUBLIC_GOOGLE_MAPS_API_KEY}
    onError={(error) => toast.error(error)}
    onResponse={(response) => {
      place = {
        provider_id: "google",
        coords: response.location,
        external_id: response.id as string,
        formatted_address: response.formattedAddress,
        name: (response.name ?? response.displayName) as string | undefined,
      };

      on_change?.(place);
    }}
  />

  <Dialog
    disabled={!place}
    size="icon"
    variant="secondary"
    title="Location"
    description={place?.formatted_address}
  >
    {#snippet trigger()}
      <Icon icon="lucide/map-pin" />
    {/snippet}

    {#snippet content()}
      {#if place}
        <GoogleMap {place} />
      {/if}
    {/snippet}
  </Dialog>
</div>
